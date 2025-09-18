import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { History, Star, Clock, Wind, Droplets, TrendingUp } from 'lucide-react'

const getCurrentUserId = () => {
  try { return JSON.parse(localStorage.getItem('user'))?.id } catch { return undefined }
}

const HistoryPage = ({ userId: propUserId, onPageChange }) => {
  const userId = propUserId || getCurrentUserId()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userId) loadHistory()
  }, [userId])

  const loadHistory = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `http://localhost:8000/api/users/${userId}/recommendations/history?page=1&per_page=10`
      )
      
      if (response.ok) {
        const data = await response.json()
        setHistory(data.recommendations || [])
      }
    } catch (error) {
      console.error('Error loading history:', error)
    } finally {
      setLoading(false)
    }
  }

  const submitFeedback = async (recommendationId, rating) => {
    try {
      const response = await fetch(`http://localhost:5000/api/recommendations/${recommendationId}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating, notes: '' })
      })
      
      if (response.ok) {
        loadHistory()
      }
    } catch (error) {
      console.error('Error submitting feedback:', error)
    }
  }

  const HistoryCard = ({ item }) => {
    const { recommendation, perfume } = item
    const [userRating, setUserRating] = useState(recommendation.user_rating || 0)

    if (!perfume) return null

    const handleRatingChange = (rating) => {
      setUserRating(rating)
      submitFeedback(recommendation.id, rating)
    }

    const formatDate = (dateString) => {
      try {
        return new Date(dateString).toLocaleDateString()
      } catch {
        return 'Unknown date'
      }
    }

    return (
      <Card className="mb-4">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{perfume.brand} - {perfume.name}</CardTitle>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="secondary">{perfume.fragrance_family}</Badge>
                <Badge variant="outline">{perfume.concentration}</Badge>
                <Badge variant="outline">
                  {formatDate(recommendation.recommendation_date)}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">AI Score</div>
              <div className="text-lg font-bold text-purple-600">
                {recommendation.utility_score?.toFixed(1)}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Context Information */}
          {(recommendation.context_mood || recommendation.context_activity || recommendation.context_weather) && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm font-medium text-gray-700 mb-2">Context</div>
              <div className="flex flex-wrap gap-2 text-sm">
                {recommendation.context_mood && (
                  <Badge variant="outline">Mood: {recommendation.context_mood}</Badge>
                )}
                {recommendation.context_activity && (
                  <Badge variant="outline">Activity: {recommendation.context_activity}</Badge>
                )}
                {recommendation.context_weather && (
                  <Badge variant="outline">Weather: {recommendation.context_weather}</Badge>
                )}
                {recommendation.context_temperature && (
                  <Badge variant="outline">Temp: {recommendation.context_temperature}°C</Badge>
                )}
              </div>
            </div>
          )}

          {/* AI Predictions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 text-blue-600">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">Longevity</span>
              </div>
              <div className="text-lg font-bold">{recommendation.predicted_longevity?.toFixed(1)}h</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 text-green-600">
                <Wind className="h-4 w-4" />
                <span className="text-sm font-medium">Projection</span>
              </div>
              <div className="text-lg font-bold">{recommendation.predicted_projection?.toFixed(1)}/10</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 text-purple-600">
                <Droplets className="h-4 w-4" />
                <span className="text-sm font-medium">Sillage</span>
              </div>
              <div className="text-lg font-bold">{recommendation.predicted_sillage?.toFixed(1)}/10</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 text-pink-600">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">Pleasantness</span>
              </div>
              <div className="text-lg font-bold">{recommendation.predicted_pleasantness?.toFixed(1)}/10</div>
            </div>
          </div>

          {/* User Feedback Section */}
          <div className="border-t pt-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Your Rating:</span>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRatingChange(star)}
                    className={`${
                      star <= userRating ? 'text-yellow-400' : 'text-gray-300'
                    } hover:text-yellow-400 transition-colors`}
                  >
                    <Star className="h-4 w-4 fill-current" />
                  </button>
                ))}
              </div>
              {userRating > 0 && (
                <span className="text-sm text-gray-600">({userRating}/5)</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your history...</p>
        </div>
      </div>
    )
  }

  if (!userId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-gray-600">Please log in to view your history.</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center space-x-2">
          <History className="h-8 w-8 text-purple-600" />
          <span>Recommendation History</span>
        </h1>
        <p className="text-gray-600">Review your past recommendations and provide feedback</p>
      </div>

      {/* History List */}
      {history.length > 0 ? (
        <div className="space-y-4">
          {history.map((item, index) => (
            <HistoryCard key={index} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No recommendations yet</h3>
          <p className="text-gray-600 mb-6">
            Get your first AI-powered perfume recommendation to start building your history.
          </p>
          <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => onPageChange && onPageChange('recommendations')}>
            Get Recommendations
          </Button>
        </div>
      )}
    </div>
  )
}

export default HistoryPage

