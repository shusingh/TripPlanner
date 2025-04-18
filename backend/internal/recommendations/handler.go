package recommendations

import (
	"encoding/json"
	"net/http"

	"github.com/shusingh/TripPlanner/backend/internal/models"
)

// Handler processes HTTP requests for travel recommendations.
// It accepts POST requests with a RecommendationRequest body and returns
// a RecommendationResponse containing AI-generated travel suggestions.
func Handler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req models.RecommendationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request payload", http.StatusBadRequest)
		return
	}

	resp, err := GetRecommendations(req)
	if err != nil {
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}
