package config

import (
	"fmt"
	"os"
)

// Config holds application configuration loaded from environment variables.
type Config struct {
	Port    string // Port on which the server listens (default "8080")
	HFToken string // Hugging Face API token (required)
}

// LoadConfig reads configuration from environment variables and applies defaults.
func LoadConfig() (*Config, error) {
	token := os.Getenv("HF_TOKEN")
	if token == "" {
		return nil, fmt.Errorf("environment variable HF_TOKEN is required")
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	return &Config{
		Port:    port,
		HFToken: token,
	}, nil
}
