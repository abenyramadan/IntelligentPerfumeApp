import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Droplets, Sun, Wind, Heart, Star, LogIn, UserPlus } from 'lucide-react'

const HomePage = ({ onPageChange, user }) => {
  const [dailyRecommendation, setDailyRecommendation] = useState(null)
  const [loading, setLoading] = useState(false)

  const quickActions = [
    {
      title: 'Get Daily Recommendation',
      description: 'AI-powered perfume suggestion for today',
      icon: Sparkles,
      color: 'bg-purple-500',
      action: () => onPageChange('recommendations')
    },
    {
      title: 'Update Profile',
      description: 'Refine your preferences and skin profile',
      icon: Droplets,
      color: 'bg-blue-500',
      action: () => onPageChange('profile')
    },
    {
      title: 'View History',
      description: 'See your past recommendations and ratings',
      icon: Star,
      color: 'bg-pink-500',
      action: () => onPageChange('history')
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
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
          Find Your Perfect
          <span className="text-purple-600"> Scent</span>
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-gray-600">
          AI-powered perfume recommendations tailored to your unique skin chemistry, 
          preferences, and daily context.
        </p>
        
        {user ? (
          // Authenticated user - show app actions
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button 
              size="lg" 
              onClick={() => onPageChange('profile')}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Get Started
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => onPageChange('recommendations')}
            >
              Try AI Recommendation
            </Button>
          </div>
        ) : (
          // Non-authenticated user - show auth buttons
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button 
              size="lg" 
              onClick={() => onPageChange('login')}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <LogIn className="mr-2 h-5 w-5" />
              Sign In
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => onPageChange('register')}
            >
              <UserPlus className="mr-2 h-5 w-5" />
              Create Account
            </Button>
          </div>
        )}
      </div>

      {/* Quick Actions - Only show for authenticated users */}
      {user && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <Card 
                key={index} 
                className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                onClick={action.action}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${action.color} text-white`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{action.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

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
            onClick={() => onPageChange('questionnaire')}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Heart className="mr-2 h-5 w-5" />
            Create Your Profile
          </Button>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => onPageChange('register')}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <UserPlus className="mr-2 h-5 w-5" />
              Get Started Free
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => onPageChange('login')}
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

