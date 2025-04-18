package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/joho/godotenv"

	"github.com/shusingh/TripPlanner/backend/internal/config"
	"github.com/shusingh/TripPlanner/backend/internal/recommendations"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Printf("No .env file found or could not load: %v", err)
	}

	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("failed to load config: %v", err)
	}

	http.HandleFunc("/api/recommendations", recommendations.Handler)

	addr := fmt.Sprintf(":%s", cfg.Port)
	log.Printf("Server listening on http://localhost%s", addr)
	if err := http.ListenAndServe(addr, nil); err != nil {
		log.Fatalf("server failed: %v", err)
	}
}
