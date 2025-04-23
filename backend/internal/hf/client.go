package hf

import (
  "bytes"
  "encoding/json"
  "errors"
  "fmt"
  "io"
  "log"
  "net/http"
)

var ErrQuotaExceeded = errors.New("hf quota exceeded")

const (
  // self‐hosted model endpoint
  Endpoint = "https://tripplannermodelserver.onrender.com/generate"
)

type inferenceRequest struct {
  Inputs     string                 `json:"inputs"`
  Parameters map[string]interface{} `json:"parameters"`
}

type inferenceResponse struct {
  GeneratedText string `json:"generated_text"`
}

// QueryHF sends the prompt to your model-server and returns the raw generated text.
// It logs key steps for debugging, without any sensitive info.
func QueryHF(prompt string) (string, error) {
  log.Printf("HF.QueryHF ▶ prompt: %q", prompt)

  // Build request body
  reqBody := inferenceRequest{
    Inputs: prompt,
    Parameters: map[string]interface{}{
      "max_new_tokens":    2000,
      "temperature":       0.7,
      "return_full_text": false,
    },
  }
  bodyBytes, err := json.Marshal(reqBody)
  if err != nil {
    log.Printf("HF.QueryHF ✖ marshal payload: %v", err)
    return "", fmt.Errorf("marshal payload: %w", err)
  }

  // Create HTTP request
  req, err := http.NewRequest("POST", Endpoint, bytes.NewBuffer(bodyBytes))
  if err != nil {
    log.Printf("HF.QueryHF ✖ create request: %v", err)
    return "", fmt.Errorf("create request: %w", err)
  }
  req.Header.Set("Content-Type", "application/json")

  // Send it
  log.Printf("HF.QueryHF ▶ sending to %s", Endpoint)
  resp, err := http.DefaultClient.Do(req)
  if err != nil {
    log.Printf("HF.QueryHF ✖ request error: %v", err)
    return "", fmt.Errorf("request error: %w", err)
  }
  defer resp.Body.Close()

  // Read response
  respBytes, err := io.ReadAll(resp.Body)
  if err != nil {
    log.Printf("HF.QueryHF ✖ read response: %v", err)
    return "", fmt.Errorf("read response: %w", err)
  }
  log.Printf("HF.QueryHF ◀ status: %d, body-length: %d", resp.StatusCode, len(respBytes))

  if resp.StatusCode == http.StatusPaymentRequired {
    log.Printf("HF.QueryHF ✖ quota exceeded")
    return "", ErrQuotaExceeded
  }
  if resp.StatusCode != http.StatusOK {
    log.Printf("HF.QueryHF ✖ non-200 status: %s", string(respBytes))
    return "", fmt.Errorf("API request failed with status %d: %s", resp.StatusCode, respBytes)
  }

  // Parse JSON
  var ir inferenceResponse
  if err := json.Unmarshal(respBytes, &ir); err != nil {
    log.Printf("HF.QueryHF ✖ unmarshal JSON: %v", err)
    return "", fmt.Errorf("unmarshal response: %w", err)
  }
  log.Printf("HF.QueryHF ✅ got %d chars", len(ir.GeneratedText))

  return ir.GeneratedText, nil
}
