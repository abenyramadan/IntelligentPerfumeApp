import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Sparkles,
  Clock,
  Wind,
  Droplets,
  Star,
  Heart,
  TrendingUp,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL } from "./constants/constants";

const getCurrentUserId = () => {
  try {
    return JSON.parse(localStorage.getItem("user"))?.id;
  } catch {
    return undefined;
  }
};

const RecommendationsPage = ({ userId: propUserId }) => {
  // Get userId from prop, localStorage, or query param
  const getUserIdFromQuery = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("userId") || getCurrentUserId();
  };
  const userId = propUserId || getUserIdFromQuery();
  const [context, setContext] = useState({
    mood: "",
    activity: "",
    weather: "",
    temperature: 20,
    humidity: 50,
  });
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const moods = [
    "Energetic",
    "Relaxed",
    "Confident",
    "Playful",
    "Serious",
    "Romantic",
    "Professional",
    "Adventurous",
    "Calm",
    "Creative",
  ];

  const activities = [
    "Office work",
    "Gym/Exercise",
    "Social event",
    "Date night",
    "Outdoor adventure",
    "Shopping",
    "Meeting",
    "Casual day",
    "Formal event",
    "Travel",
  ];

  const weatherOptions = [
    "Sunny",
    "Cloudy",
    "Rainy",
    "Hot",
    "Cold",
    "Humid",
    "Dry",
    "Windy",
  ];

  const updateContext = (field, value) => {
    setContext((prev) => ({ ...prev, [field]: value }));
  };

  const getAIRecommendations = async () => {
    setLoading(true);
    try {
      if (userId) {
        const payload = {
          user_id: userId,
          mood: context.mood,
          activity: context.activity,
          primary_climate: context.primary_climate,
          temperature: context.temperature,
          humidity: context.humidity,
        };

        const url = API_BASE_URL + "/ai/";
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (response.ok) {
          const data = await response.json();
          const mapped = Array.isArray(data.recommendations)
            ? data.recommendations.slice(0, 3).map((p) => ({ perfume: p }))
            : [];
          setRecommendations(mapped);
          toast.success("Personalized recommendations loaded!");
        } else {
          const error = await response.json();
          toast.error(error.error || "Failed to get recommendations");
        }
      } else {
        toast.error("No user ID found for recommendations");
      }
    } catch (error) {
      console.error("Error getting recommendations:", error);
      toast.error("Error getting recommendations");
    } finally {
      setLoading(false);
    }
  };

  const getRecommendations = async () => {
    await getAIRecommendations();
  };

  // Auto-fetch recommendations on mount if userId is present in query
  useEffect(() => {
    // Check if recommendations are passed from questionnaire
    const stored = localStorage.getItem("recommendations");
    if (stored) {
      setRecommendations(JSON.parse(stored));
      localStorage.removeItem("recommendations");
    } else if (userId) {
      getAIRecommendations();
    }
  }, [userId]);

  const submitFeedback = async (recommendationId, rating) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/recommendations/${recommendationId}/feedback`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ rating }),
        }
      );

      if (response.ok) {
        toast.success("Thank you for your feedback!");
      } else {
        toast.error("Failed to submit feedback");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Error submitting feedback");
    }
  };

  const PerfumeCard = ({ recommendation }) => {
    if (!recommendation || !recommendation.perfume) return null;
    const perfume = recommendation.perfume;
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">
                {perfume.brand} - {perfume.name}
              </CardTitle>
              <div className="flex flex-wrap gap-2 mt-2">
                {perfume.fragrance_family && (
                  <Badge variant="secondary">{perfume.fragrance_family}</Badge>
                )}
                {perfume.price && (
                  <Badge variant="outline">${perfume.price}</Badge>
                )}
                {perfume.longevity_hours && (
                  <Badge variant="outline">
                    Longevity: {perfume.longevity_hours}h
                  </Badge>
                )}
                {perfume.sillage && (
                  <Badge variant="outline">Sillage: {perfume.sillage}</Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {perfume.image_url && (
            <img
              src={perfume.image_url}
              alt={perfume.name}
              className="w-32 h-32 object-cover rounded"
            />
          )}
          {/* Fragrance Notes */}
          <div className="space-y-2">
            {perfume.top_notes?.length > 0 && (
              <div className="text-sm">
                <strong>Top:</strong> {perfume.top_notes.join(", ")}
              </div>
            )}
            {perfume.middle_notes?.length > 0 && (
              <div className="text-sm">
                <strong>Middle:</strong> {perfume.middle_notes.join(", ")}
              </div>
            )}
            {perfume.base_notes?.length > 0 && (
              <div className="text-sm">
                <strong>Base:</strong> {perfume.base_notes.join(", ")}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (!userId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-gray-600">
          Please log in to see recommendations.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">AI Recommendations</h1>
        <p className="text-gray-600">
          Get personalized perfume suggestions based on your current context
        </p>
      </div>

      {/* Context Input */}
      <Card>
        <CardHeader>
          <CardTitle>Current Context</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="mood">Current Mood</Label>
              <Select
                value={context.mood}
                onValueChange={(value) => updateContext("mood", value)}
                placeholder="Select Mood"
              >
                <SelectContent>
                  <SelectItem value="Happy">Happy</SelectItem>
                  <SelectItem value="Sad">Sad</SelectItem>
                  <SelectItem value="Angry">Angry</SelectItem>
                  <SelectItem value="Neutral">Neutral</SelectItem>
                  <SelectItem value="Excited">Excited</SelectItem>
                  <SelectItem value="Relaxed">Relaxed</SelectItem>
                  <SelectItem value="Stressed">Stressed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="activity">Planned Activity</Label>
              <Select
                value={context.activity}
                onValueChange={(value) => updateContext("activity", value)}
                placeholder="Select Activity"
              >
                <SelectContent>
                  <SelectItem value="Date Night">Date Night</SelectItem>
                  <SelectItem value="Office">Office</SelectItem>
                  <SelectItem value="Evening Walk">Evening Walk</SelectItem>
                  <SelectItem value="Travel">Travel</SelectItem>
                  <SelectItem value="Gym">Gym</SelectItem>
                  <SelectItem value="Social Event">Social Event</SelectItem>
                  <SelectItem value="Casual Day">Casual Day</SelectItem>
                  <SelectItem value="Formal Event">Formal Event</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="primary_climate">Primary Climate</Label>
              <Select
                value={context.primary_climate}
                onValueChange={(value) =>
                  updateContext("primary_climate", value)
                }
                placeholder="Select climate"
              >
                <SelectContent>
                  <SelectItem value="Hot & Humid">Hot & Humid</SelectItem>
                  <SelectItem value="Hot & Dry">Hot & Dry</SelectItem>
                  <SelectItem value="Temperate">Temperate</SelectItem>
                  <SelectItem value="Cold">Cold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Temperature: {context.temperature}°C</Label>
              <Slider
                value={[context.temperature]}
                onValueChange={([value]) => updateContext("temperature", value)}
                max={40}
                min={-10}
                step={1}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Humidity: {context.humidity}%</Label>
              <Slider
                value={[context.humidity]}
                onValueChange={([value]) => updateContext("humidity", value)}
                max={100}
                min={0}
                step={5}
                className="mt-2"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={getRecommendations}
              disabled={loading}
              variant="outline"
            >
              <Heart className="mr-2 h-4 w-4" />
              {loading ? "Finding Matches..." : "Get Recommendations"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Multiple Recommendations */}
      {recommendations.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">
            All Recommendations
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recommendations.map((rec, index) => (
              <PerfumeCard key={index} recommendation={rec} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && recommendations.length === 0 && (
        <div className="text-center py-12">
          <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Ready for AI Magic?
          </h3>
          <p className="text-gray-600 mb-6">
            Fill in your current context above and get personalized perfume
            recommendations powered by our advanced AI algorithm.
          </p>
          <Button
            onClick={getRecommendations}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Get Started
          </Button>
        </div>
      )}
    </div>
  );
};

export default RecommendationsPage;
