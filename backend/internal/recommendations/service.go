package recommendations

import (
	"encoding/json"
	"fmt"
	"strings"

	"github.com/shusingh/TripPlanner/backend/internal/groq"
	"github.com/shusingh/TripPlanner/backend/internal/models"
)

// GetRecommendations generates travel recommendations for a given destination and date range.
// It uses the Groq API to generate personalized suggestions for attractions,
// food places, and other points of interest based on the provided tags.
func GetRecommendations(req models.RecommendationRequest) (models.RecommendationResponse, error) {
	// Construct the prompt for the AI model
	prompt := fmt.Sprintf(
		`You are a JSON generator. 
	  
		**Respond with exactly one JSON object and nothing else.** 
		The JSON must have these three keys: 
		  "attractions": an array of objects {name, description, latitude, longitude, url}, 
		  "food": same shape, 
		  "other": same shape.
	  
		Now generate that object for:
		Destination: %s
		Dates: from %s to %s
		Tags: %s
		`,
		req.Destination,
		req.StartDate,
		req.EndDate,
		strings.Join(req.Tags, ", "),
	  )	  

	// Query the Groq API
	generated, err := groq.QueryGroq(prompt)
	if err != nil {
		return models.RecommendationResponse{}, fmt.Errorf("Groq query failed: %w", err)
	}

	// Parse the generated JSON into our response model
	var resp models.RecommendationResponse
	if err := json.Unmarshal([]byte(generated), &resp); err != nil {
		return models.RecommendationResponse{}, fmt.Errorf("failed to parse AI output: %w", err)
	}

	return resp, nil
}
