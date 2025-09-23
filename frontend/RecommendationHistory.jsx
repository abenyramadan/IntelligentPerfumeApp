import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const BASE_API = "http://127.0.0.1:8000";

const RecommendationHistory = ({ userId, showAsPage = false }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Storage key for local caching
  const getStorageKey = (userId) => `recommendation_history_${userId}`;

  // Save recommendations to localStorage for offline access
  const saveToLocalStorage = (recommendations, userId) => {
    try {
      const storageKey = getStorageKey(userId);
      localStorage.setItem(storageKey, JSON.stringify({
        recommendations,
        lastUpdated: new Date().toISOString(),
        userId
      }));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  };

  // Load recommendations from localStorage
  const loadFromLocalStorage = (userId) => {
    try {
      const storageKey = getStorageKey(userId);
      const cached = localStorage.getItem(storageKey);
      if (cached) {
        const data = JSON.parse(cached);
        // Only return if it's for the same user and not too old (24 hours)
        const isRecent = data.lastUpdated &&
          (new Date() - new Date(data.lastUpdated)) < (24 * 60 * 60 * 1000);
        if (data.userId === userId && isRecent) {
          return data.recommendations;
        }
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
    return null;
  };

  // Fetch recommendations from server
  const fetchRecommendations = async (userId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${BASE_API}/recommendations/my?user_id=${userId}&limit=50`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          const recs = data.data;
          setRecommendations(recs);
          saveToLocalStorage(recs, userId); // Cache locally
          return recs;
        } else {
          throw new Error(data.message || 'Failed to fetch recommendations');
        }
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setError(error.message);

      // Try to load from localStorage as fallback
      const cached = loadFromLocalStorage(userId);
      if (cached) {
        setRecommendations(cached);
        toast.info("Loaded recommendations from cache");
        return cached;
      }

      return [];
    } finally {
      setLoading(false);
    }
  };

  // Refresh recommendations
  const refreshRecommendations = () => {
    if (userId) {
      fetchRecommendations(userId);
    }
  };

  // Load recommendations on component mount
  useEffect(() => {
    if (userId) {
      fetchRecommendations(userId);
    } else {
      setLoading(false);
    }
  }, [userId]);

  // Format date for display
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Unknown date';
    }
  };

  // Render recommendation card
  const renderRecommendationCard = (rec, index) => (
    <Card key={rec.id || index} className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">
              {rec.ai_perfume_name || rec.perfume || `Recommendation #${rec.id || index + 1}`}
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              {formatDate(rec.created_at)}
            </p>
          </div>
          <div className="flex gap-2">
            {rec.price && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                ${rec.price.toFixed(2)}
              </Badge>
            )}
            {rec.utility_score && (
              <Badge variant="outline">
                Score: {rec.utility_score}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {rec.reason && (
          <p className="text-gray-700 mb-3">{rec.reason.substring(0, 200)}...</p>
        )}

        {rec.other_perfumes_to_try && rec.other_perfumes_to_try.length > 0 && (
          <div className="mt-3">
            <h4 className="font-semibold text-sm mb-2">Alternative Options:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {rec.other_perfumes_to_try.map((alt, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium text-sm">{alt.name || 'Unknown'}</p>
                    {alt.price && <p className="text-xs text-gray-600">${alt.price.toFixed(2)}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {rec.context_mood && (
          <div className="mt-3 pt-3 border-t">
            <div className="flex flex-wrap gap-2">
              {rec.context_mood && (
                <Badge variant="outline" className="text-xs">
                  Mood: {rec.context_mood}
                </Badge>
              )}
              {rec.context_activity && (
                <Badge variant="outline" className="text-xs">
                  Activity: {rec.context_activity}
                </Badge>
              )}
              {rec.context_temperature && (
                <Badge variant="outline" className="text-xs">
                  Temp: {rec.context_temperature}°C
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  // Loading state
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your recommendation history...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error && recommendations.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading History</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={refreshRecommendations} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No recommendations state
  if (recommendations.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Recommendation History</CardTitle>
          </CardHeader>
          <CardContent className="text-center p-8">
            <div className="mb-4">
              <div className="text-6xl mb-4">🫧</div>
              <h3 className="text-lg font-semibold mb-2">No Recommendations Yet</h3>
              <p className="text-gray-600 mb-4">
                You haven't received any AI-powered perfume recommendations yet.
                Visit your profile to get personalized suggestions!
              </p>
              <Button onClick={() => window.location.href = '/profile'}>
                Get Your First Recommendation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main content
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {showAsPage ? 'Your Recommendation History' : 'Recent Recommendations'}
          </h1>
          <p className="text-gray-600 mt-2">
            {recommendations.length} recommendation{recommendations.length !== 1 ? 's' : ''} saved
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={refreshRecommendations} variant="outline" size="sm">
            Refresh
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec, index) => renderRecommendationCard(rec, index))}
      </div>

      {recommendations.length > 0 && (
        <Card className="mt-8">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Want New Recommendations?</h3>
            <p className="text-gray-600 mb-4">
              Visit your profile to get fresh AI-powered perfume suggestions tailored to your preferences.
            </p>
            <Button onClick={() => window.location.href = '/profile'}>
              Get New Recommendations
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RecommendationHistory;
