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
import { API_BASE_URL } from "./constants/constants";

const getCurrentUserId = () => {
  try {
    return JSON.parse(localStorage.getItem("user"))?.user_id;
  } catch {
    return undefined;
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
    userId !== undefined && userId !== null;

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

        const url = API_BASE_URL + "/ai/";
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (response.ok) {
          const data = await response.json();
          setRecommendations(data.data || []);
          toast.success("Personalized recommendations loaded!");
        } else {
          const error = await response.json();
          toast.error(error.error || "Failed to get recommendations");
        }
      } else {
        toast.error("Please select all fields before getting recommendations.");
      }
    } catch (error) {
      console.error("Error getting recommendations:", error);
      toast.error("Error getting recommendations");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Get AI Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Context Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Mood</Label>
              <select
                value={context.mood}
                onChange={e => updateContext("mood", e.target.value)}
              >
                <option value="">Select Mood</option>
                {moods.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Activity</Label>
              <select
                value={context.activity}
                onChange={e => updateContext("activity", e.target.value)}
              >
                <option value="">Select Activity</option>
                {activities.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Primary Climate</Label>
              <select
                value={context.primary_climate}
                onChange={e => updateContext("primary_climate", e.target.value)}
              >
                <option value="">Select Climate</option>
                {climates.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
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

          <div className="flex justify-center mt-6">
            <Button
              onClick={getAIRecommendations}
              disabled={!isReady || loading}
            >
              <Heart className="mr-2 h-4 w-4" />
              {loading ? "Finding Matches..." : "Get Recommendation"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Display Recommendations */}
      {recommendations.length > 0 && (
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Recommendations</h2>
          {recommendations.map((rec, idx) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle>{rec.perfume || "Perfume Recommendation"}</CardTitle>
              </CardHeader>
              <CardContent>
                {rec.reason && (
                  <p className="text-gray-700">{rec.reason}</p>
                )}
                {/* Add more perfume details here as needed */}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendationsPage;