import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Droplets, Sun, Wind, Heart, Star, LogIn, UserPlus, User, History } from 'lucide-react'
import { useNavigate } from "react-router-dom";

const HomePage = ({ onPageChange, user }) => {
  const [dailyRecommendation, setDailyRecommendation] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Create/Update Profile',
      description: 'Refine your preferences and skin profile',
      icon: <User className="h-6 w-6 text-purple-600" />,
      action: () => navigate('./profile'),
      color: 'bg-purple-100'
    },
    {
      title: 'Try AI Recommendation',
      description: 'Get a personalized scent suggestion',
      icon: <Sparkles className="h-6 w-6 text-pink-500" />,
      action: () => navigate('./recommendations'),
      color: 'bg-pink-100'
    },
    {
      title: 'View History',
      description: 'See your past recommendations and ratings',
      icon: <History className="h-6 w-6 text-blue-500" />,
      action: () => navigate('./history'),
      color: 'bg-blue-100'
    }
  ]

  const features = [
    {
      title: 'AI-Powered Matching',
      description: 'Advanced algorithms analyze your skin chemistry, preferences, and environment',
      icon: Sparkles
    },
    {
      title: 'Personalized Profiles',
      description: 'Detailed questionnaire captures your unique characteristics',
      icon: Droplets
    },
    {
      title: 'Daily Recommendations',
      description: 'Context-aware suggestions based on weather, mood, and activities',
      icon: Sun
    },
    {
      title: 'Performance Prediction',
      description: 'Predict longevity, projection, and sillage for your skin',
      icon: Wind
    }
  ]

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      {/* Welcome Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-purple-700 mb-2">
          Welcome back, {user?.username || "Scent Lover"}!
        </h1>
        <p className="text-lg text-gray-600">
          Ready to discover your next favorite fragrance?
        </p>
      </div>

      {/* Quick Actions - Only show for authenticated users */}
      {user && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {quickActions.map((action, idx) => {
            return (
              <div
                key={idx}
                className={`rounded-xl shadow hover:shadow-lg transition p-6 flex flex-col items-center text-center cursor-pointer ${action.color}`}
                onClick={action.action}
              >
                <div className="mb-3">{action.icon}</div>
                <h3 className="text-xl font-semibold mb-1">{action.title}</h3>
                <p className="text-gray-600">{action.description}</p>
              </div>
            )
          })}
        </div>
      )}

      {/* Personalized Section */}
      <div className="bg-white rounded-xl shadow p-8 text-center">
        <h2 className="text-2xl font-bold text-purple-700 mb-4">
          Your Personalized Scent Journey
        </h2>
        <p className="text-gray-700 mb-6">
          Explore recommendations, update your profile, and track your favorites. ScentAI learns and adapts to your preferences every day!
        </p>
        <Button
          size="lg"
          onClick={() => navigate('recommendations')}
          className="bg-gradient-to-r from-purple-600 to-pink-500 text-white"
        >
          <Sparkles className="mr-2 h-5 w-5" />
          Get Today's Recommendation
        </Button>
      </div>

      {/* Features Section */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          How ScentAI Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                  <Icon className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold">1000+</div>
            <div className="text-purple-100">Perfumes in Database</div>
          </div>
          <div>
            <div className="text-3xl font-bold">95%</div>
            <div className="text-purple-100">Accuracy Rate</div>
          </div>
          <div>
            <div className="text-3xl font-bold">50+</div>
            <div className="text-purple-100">Factors Analyzed</div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Ready to Discover Your Signature Scent?
        </h2>
        <p className="text-gray-600 mb-6">
          Join thousands of fragrance enthusiasts who trust ScentAI for their daily scent selection.
        </p>
        {user ? (
          <Button 
            size="lg"
            onClick={() => navigate('./profile')}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Heart className="mr-2 h-5 w-5" />
            Create Your Profile
          </Button>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => navigate("/register")}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <UserPlus className="mr-2 h-5 w-5" />
              Get Started Free
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate("/login")}
            >
              <LogIn className="mr-2 h-5 w-5" />
              Sign In
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage

