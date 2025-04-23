package hf

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"regexp"
)

var ErrQuotaExceeded = errors.New("hf quota exceeded")

const (
	Endpoint = "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1"
)

// QueryHF sends a prompt to the Hugging Face API and returns the generated response.
// It handles authentication, request formatting, and response parsing to extract
// the JSON content from the model's output.
func QueryHF(prompt string) (string, error) {
	payload := map[string]interface{}{
		"inputs": prompt,
		"parameters": map[string]interface{}{
			"max_new_tokens":    2000,
			"temperature":       0.7,
			"return_full_text": false,
		},
	}
	bodyBytes, err := json.Marshal(payload)
	if err != nil {
		return "", fmt.Errorf("marshal payload: %w", err)
	}

	req, err := http.NewRequest("POST", Endpoint, bytes.NewBuffer(bodyBytes))
	if err != nil {
		return "", fmt.Errorf("create request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")

	token := os.Getenv("HF_TOKEN")
	if token == "" {
		return "", fmt.Errorf("HF_TOKEN environment variable is not set")
	}
	req.Header.Set("Authorization", "Bearer "+token)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", fmt.Errorf("request error: %w", err)
	}
	defer resp.Body.Close()

	respBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("read response: %w", err)
	}

	if resp.StatusCode == 402 {
		// free-tier quota exhausted
		return "", ErrQuotaExceeded
	  }

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("API request failed with status %d: %s", resp.StatusCode, string(respBytes))
	}

	var result []map[string]interface{}
	if err := json.Unmarshal(respBytes, &result); err != nil {
		return "", fmt.Errorf("parse response: %w", err)
	}

	if len(result) == 0 {
		return "", fmt.Errorf("empty response from API")
	}

	generatedText, ok := result[0]["generated_text"].(string)
	if !ok {
		return "", fmt.Errorf("invalid response format")
	}

	re := regexp.MustCompile(`(?s)\{.*\}`)
	match := re.FindString(generatedText)
	if match == "" {
		return "", fmt.Errorf("no JSON found in response")
	}

	var jsonObj map[string]interface{}
	if err := json.Unmarshal([]byte(match), &jsonObj); err != nil {
		return "", fmt.Errorf("invalid JSON in response: %w", err)
	}

	return match, nil
}
