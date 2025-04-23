export interface Place {
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  url?: string;
}

export interface RecommendationResponse {
  attractions: Place[];
  food: Place[];
  other?: Place[];
}
