package hf

import (
  "bytes"
  "encoding/json"
  "errors"
  "fmt"
  "io"
  "net/http"
  "os"
)

var ErrQuotaExceeded = errors.New("hf quota exceeded")

const (
  // Switch this to any HF-hosted model you prefer:
  Endpoint = "https://api-inference.huggingface.co/models/google/flan-t5-base"
)

// inferenceRequest is what HF expects in the POST body.
type inferenceRequest struct {
  Inputs     string                 `json:"inputs"`
  Parameters map[string]interface{} `json:"parameters,omitempty"`
}

// inferenceResponse is how HF returns the generated text.
type inferenceResponse []struct {
  GeneratedText string `json:"generated_text"`
}

// QueryHF sends the prompt to Hugging Face, returning the raw generated_text.
// If you hit your free-tier quota (HTTP 402), it returns ErrQuotaExceeded.
func QueryHF(prompt string) (string, error) {
  // Build the request payload
  reqBody := inferenceRequest{
    Inputs: prompt,
    Parameters: map[string]interface{}{
      "max_new_tokens": 2000,
      "temperature":    0.7,
    },
  }
  bodyBytes, err := json.Marshal(reqBody)
  if err != nil {
    return "", fmt.Errorf("marshal payload: %w", err)
  }

  // Create HTTP request
  req, err := http.NewRequest("POST", Endpoint, bytes.NewReader(bodyBytes))
  if err != nil {
    return "", fmt.Errorf("create request: %w", err)
  }
  req.Header.Set("Content-Type", "application/json")

  // Attach your HF token from the env
  token := os.Getenv("HF_TOKEN")
  if token == "" {
    return "", fmt.Errorf("HF_TOKEN environment variable is not set")
  }
  req.Header.Set("Authorization", "Bearer "+token)

  // Send to HF
  resp, err := http.DefaultClient.Do(req)
  if err != nil {
    return "", fmt.Errorf("request error: %w", err)
  }
  defer resp.Body.Close()

  // Read the full response body
  respBytes, err := io.ReadAll(resp.Body)
  if err != nil {
    return "", fmt.Errorf("read response: %w", err)
  }

  // Handle out-of-quota
  if resp.StatusCode == http.StatusPaymentRequired {
    return "", ErrQuotaExceeded
  }
  if resp.StatusCode != http.StatusOK {
    return "", fmt.Errorf("HF API failed %d: %s", resp.StatusCode, respBytes)
  }

  // Parse into our struct
  var ir inferenceResponse
  if err := json.Unmarshal(respBytes, &ir); err != nil {
    return "", fmt.Errorf("unmarshal response: %w", err)
  }
  if len(ir) == 0 {
    return "", fmt.Errorf("empty response from HF")
  }

  return ir[0].GeneratedText, nil
}
