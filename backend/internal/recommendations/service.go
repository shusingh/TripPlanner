package recommendations

import (
	"encoding/json"
	"fmt"
	"strings"

	"github.com/shusingh/TripPlanner/backend/internal/hf"
	"github.com/shusingh/TripPlanner/backend/internal/models"
)

// GetRecommendations generates travel recommendations for a given destination and date range.
// It uses the Hugging Face API to generate personalized suggestions for attractions,
// food places, and other points of interest based on the provided tags.
func GetRecommendations(req models.RecommendationRequest) (models.RecommendationResponse, error) {
	// Construct the prompt for the AI model
	prompt := fmt.Sprintf(
		`You are a travel assistant.
Produce a JSON object with fields "attractions", "food", "other".
Each field is an array of objects with keys: name, description, latitude, longitude, url.
User wants suggestions for %s from %s to %s with tags %s.`,
		req.Destination,
		req.StartDate,
		req.EndDate,
		strings.Join(req.Tags, ", "),
	)

	// Query the Hugging Face API
	generated, err := hf.QueryHF(prompt)
	if err != nil {
		return models.RecommendationResponse{}, fmt.Errorf("HF query failed: %w", err)
	}

	// Parse the generated JSON into our response model
	var resp models.RecommendationResponse
	if err := json.Unmarshal([]byte(generated), &resp); err != nil {
		return models.RecommendationResponse{}, fmt.Errorf("failed to parse AI output: %w", err)
	}

	return resp, nil
}
