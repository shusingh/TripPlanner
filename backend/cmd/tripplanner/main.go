package main

import (
  "log"
  "net/http"

  "github.com/joho/godotenv"
  "github.com/shusingh/TripPlanner/backend/internal/config"
  "github.com/shusingh/TripPlanner/backend/internal/recommendations"
)

// corsMiddleware adds CORS headers and handles OPTIONS preflight.
func corsMiddleware(next http.Handler) http.Handler {
  return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    // Allow your frontend’s origin (or use "*" to allow all)
    w.Header().Set("Access-Control-Allow-Origin", "https://tripplannerwebsite.onrender.com")
    w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
    w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    // Preflight request
    if r.Method == http.MethodOptions {
      w.WriteHeader(http.StatusOK)
      return
    }

    next.ServeHTTP(w, r)
  })
}

func main() {
  // Load .env locally; in production it'll just log a warning
  if err := godotenv.Load(); err != nil {
    log.Printf("No .env file found or could not load: %v", err)
  }

  cfg, err := config.LoadConfig()
  if err != nil {
    log.Fatalf("failed to load config: %v", err)
  }

  // Wrap the recommendations.Handler with our CORS middleware
  http.Handle(
    "/api/recommendations",
    corsMiddleware(http.HandlerFunc(recommendations.Handler)),
  )

  addr := ":" + cfg.Port
  log.Printf("Server listening on http://localhost%s", addr)
  if err := http.ListenAndServe(addr, nil); err != nil {
    log.Fatalf("server failed: %v", err)
  }
}
