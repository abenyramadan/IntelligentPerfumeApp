import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import RecommendationGallery from "./RecommendationGallery";

const getCurrentUserId = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    // Try different possible user ID fields (id first, then user_id)
    return user?.id || user?.user_id || null;
  } catch {
    return null; // Return null instead of 1 to avoid showing wrong user's data
  }
};

const RecommendationsPage = ({ userId: propUserId }) => {
  const userId = propUserId || getCurrentUserId();

  const [context, setContext] = useState({
    mood: "",
    activity: "",
    primary_climate: "",
    temperature: 24,
    humidity: 60,
  });
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const moods = [
    "Stressed",
    "Happy",
    "Sad",
    "Angry",
    "Neutral",
    "Excited",
    "Relaxed",
  ];

  const activities = [
    "Office",
    "Date Night",
    "Evening Walk",
    "Travel",
    "Gym",
    "Social Event",
    "Casual Day",
    "Formal Event",
  ];

  const climates = [
    "Hot",
    "Hot & Humid",
    "Hot & Dry",
    "Temperate",
    "Cold",
  ];

  const updateContext = (field, value) => {
    setContext((prev) => ({ ...prev, [field]: value }));
  };

  // Check if all required fields are selected
  const isReady =
    context.mood &&
    context.activity &&
    context.primary_climate &&
    userId !== undefined && userId !== null && userId !== "";

  const getAIRecommendations = async () => {
    setLoading(true);

    try {
      if (isReady) {
        const payload = {
          user_id: userId,
          mood: context.mood,
          activity: context.activity,
          primary_climate: context.primary_climate,
          temperature: context.temperature,
          humidity: context.humidity,
        };

        const response = await fetch("http://127.0.0.1:8000/ai/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const data = await response.json();

          // Handle different response structures
          const recommendationsData = data.data || data;
          if (Array.isArray(recommendationsData)) {
            setRecommendations(recommendationsData);
          } else if (recommendationsData && typeof recommendationsData === 'object') {
            setRecommendations([recommendationsData]);
          } else {
            setRecommendations([]);
            toast.error("No recommendations available at the moment.");
          }

          toast.success("Perfect match found!");
        } else {
          const error = await response.json();

          // Provide user-friendly error messages
          if (response.status === 400) {
            toast.error("Please complete your profile first to receive personalized recommendations.");
          } else if (response.status === 500) {
            toast.error("Our recommendation service is temporarily unavailable. Please try again in a few moments.");
          } else {
            toast.error("Unable to get recommendations right now. Please try again.");
          }
        }
      } else {
        toast.error("Please select your mood, activity, and climate conditions.");
      }
    } catch (error) {
      toast.error("Connection issue. Please check your internet connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>AI Fragrance Recommendations</CardTitle>
          <p className="text-sm text-gray-600">
            Get personalized fragrance suggestions based on your current mood and environment.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Context Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="mood">Current Mood</Label>
              <select
                id="mood"
                value={context.mood}
                onChange={e => updateContext("mood", e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select mood</option>
                {moods.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="activity">Activity</Label>
              <select
                id="activity"
                value={context.activity}
                onChange={e => updateContext("activity", e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select activity</option>
                {activities.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="climate">Environment</Label>
              <select
                id="climate"
                value={context.primary_climate}
                onChange={e => updateContext("primary_climate", e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select environment</option>
                {climates.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Environmental Factors */}
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

          <div className="flex justify-center mt-6">
            <Button
              onClick={getAIRecommendations}
              disabled={!isReady || loading}
              className="px-8"
            >
              {loading ? "Analyzing..." : "Get Recommendation"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Display Recommendations */}
      {recommendations.length > 0 && (
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Your Recommendations</h2>
          {recommendations.map((rec, idx) => (
            <RecommendationGallery
              key={`rec-${idx}`}
              recommendation={rec}
            />
          ))}
        </div>
      )}

      {/* No Recommendations Message */}
      {recommendations.length === 0 && !loading && (
        <div className="mt-8 text-center">
          <p className="text-gray-500">
            Select your preferences above and click "Get Recommendation" to see personalized fragrance suggestions.
          </p>
        </div>
      )}
    </div>
  );
};

export default RecommendationsPage;