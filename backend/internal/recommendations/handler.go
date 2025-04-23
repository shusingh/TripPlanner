package recommendations

import (
  "encoding/json"
  "errors"
  "log"
  "net/http"

  "github.com/shusingh/TripPlanner/backend/internal/hf"
  "github.com/shusingh/TripPlanner/backend/internal/models"
)

// Handler processes HTTP requests for travel recommendations.
func Handler(w http.ResponseWriter, r *http.Request) {
  if r.Method != http.MethodPost {
    http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
    return
  }

  // Decode incoming JSON
  var req models.RecommendationRequest
  if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
    log.Printf("❌ Handler: invalid request payload: %v", err)
    http.Error(w, "invalid request payload", http.StatusBadRequest)
    return
  }
  log.Printf("ℹ️  Handler: got request %+v", req)

  resp, err := GetRecommendations(req)
  if err != nil {
    log.Printf("❌ Handler: GetRecommendations error: %v", err)
    // If the root cause was HF quota exhaustion, return 503 & a clear message:
    if errors.Is(err, hf.ErrQuotaExceeded) {
      http.Error(w,
        "Hugging Face quota exceeded; please try again later or upgrade your plan",
        http.StatusServiceUnavailable,
      )
    } else {
      http.Error(w, "internal server error", http.StatusInternalServerError)
    }
    return
  }
  log.Printf("✅ Handler: sending response with %d attractions, %d food, %d other",
    len(resp.Attractions), len(resp.Food), len(resp.Other),
  )

  // Write JSON back to client
  w.Header().Set("Content-Type", "application/json")
  if err := json.NewEncoder(w).Encode(resp); err != nil {
    log.Printf("❌ Handler: error encoding JSON response: %v", err)
  }
}
