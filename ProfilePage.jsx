import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { User, Droplets, Thermometer, Wind, Heart, AlertTriangle, Zap, Clock } from 'lucide-react'
import { toast } from 'sonner'
import { useUserProfile } from "./services/useApi";


const getCurrentUserId = () => {
  try { return JSON.parse(localStorage.getItem('user'))?.id } catch { return undefined }
}

const ProfilePage = ({ userId: propUserId }) => {
  const resolvedUserId = propUserId || getCurrentUserId()
  const { profile: apiProfile, loading: apiLoading, saveProfile } = useUserProfile(resolvedUserId);
  
  const [profile, setProfile] = useState({
    // Skin/Body Chemistry
    skin_type: '',
    skin_temperature: '',
    skin_hydration: '',
    skin_ph: '',
    recent_body_state: '',
    
    // Climate & Environment
    primary_climate: '',
    avg_temperature: '',
    avg_humidity: '',
    typical_environment: '',
    ventilation: '',
    airflow: '',
    
    // Preferences
    preferred_families: [],
    disliked_families: [],
    preferred_intensity: '',
    longevity_target: 6,
    gender_presentation: '',
    preferred_character: '',
    projection_goal: '',
    sillage_tolerance_hot: '',
    seasonal_focus: '',
    budget_min: 0,
    budget_max: 300,
    
    // Sensitivities
    allergies: [],
    headache_triggers: [],
    self_anosmia_musks: '',
    sensitivity_sweetness: '',
    sensitivity_projection: '',
    
    // Application
    number_of_sprays: 3,
    preferred_concentration: '',
    spray_location: '',
    fabric_type: '',
    
    // Decision Window
    time_window_start: 0,
    time_window_end: 8,
    projection_weight: 1.0
  })
  
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(false)

  const fragranceFamilies = [
    'Citrus', 'Green', 'Aromatic', 'Floral', 'White Floral', 'Fruity',
    'Chypre', 'Woody', 'Amber', 'Oriental/Spicy', 'Leather', 'Musk'
  ]

  const allergens = [
    'Citrus oils', 'Aldehydes', 'Iso E Super', 'Ambroxan', 'Musks', 'Lavender'
  ]

  // Load profile data when API profile changes
  useEffect(() => {
    if (apiProfile) {
      setProfile(prevProfile => ({
        ...prevProfile,
        ...apiProfile
      }))
    }
  }, [apiProfile])

  const handleInputChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const toggleArrayItem = (field, item) => {
    setProfile(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }))
  }

  if (!resolvedUserId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-gray-600">Please log in to view your profile.</div>
      </div>
    )
  }

  if (apiLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  // Function to get recommendations from AI
  const getAIRecommendations = async () => {
    setLoading(true)
    try {
      // Call Flask backend to proxy Fragella top 3 matches
      const response = await fetch('http://localhost:5000/api/fragella/top3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      })
      if (response.ok) {
        const aiData = await response.json()
        setRecommendations(aiData.fragrances || aiData.results || aiData)
      } else {
        setRecommendations([])
      }
    } catch (error) {
      setRecommendations([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Your Scent Profile</h1>
        <p className="text-gray-600">Help us understand your unique characteristics for better recommendations</p>
      </div>

      {/* Skin Chemistry Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Droplets className="h-5 w-5 text-blue-500" />
            <span>Skin Chemistry</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="skin_type">Skin Type</Label>
              <Select value={profile.skin_type} onValueChange={(value) => handleInputChange('skin_type', value)} placeholder="Select skin type">
                <SelectContent>
                  <SelectItem value="Dry">Dry</SelectItem>
                  <SelectItem value="Balanced">Balanced</SelectItem>
                  <SelectItem value="Oily">Oily</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="skin_temperature">Skin Temperature</Label>
              <Select value={profile.skin_temperature} onValueChange={(value) => handleInputChange('skin_temperature', value)} placeholder="Select skin temperature">
                <SelectContent>
                  <SelectItem value="Cool">Cool</SelectItem>
                  <SelectItem value="Neutral">Neutral</SelectItem>
                  <SelectItem value="Warm">Warm</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="skin_hydration">Skin Hydration</Label>
              <Select value={profile.skin_hydration} onValueChange={(value) => handleInputChange('skin_hydration', value)} placeholder="Select hydration level">
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="skin_ph">Skin pH (if known)</Label>
              <Select value={profile.skin_ph} onValueChange={(value) => handleInputChange('skin_ph', value)} placeholder="Select pH level">
                <SelectContent>
                  <SelectItem value="Acidic">Acidic (&lt;5.5)</SelectItem>
                  <SelectItem value="Neutral">Neutral (~5.5)</SelectItem>
                  <SelectItem value="Alkaline">Slightly Alkaline (&gt;6)</SelectItem>
                  <SelectItem value="Unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Environment Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Thermometer className="h-5 w-5 text-orange-500" />
            <span>Environment & Climate</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="primary_climate">Primary Climate</Label>
              <Select value={profile.primary_climate} onValueChange={(value) => handleInputChange('primary_climate', value)} placeholder="Select climate">
                <SelectContent>
                  <SelectItem value="Hot & Humid">Hot & Humid</SelectItem>
                  <SelectItem value="Hot & Dry">Hot & Dry</SelectItem>
                  <SelectItem value="Temperate">Temperate</SelectItem>
                  <SelectItem value="Cold">Cold</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="avg_temperature">Average Temperature</Label>
              <Select value={profile.avg_temperature} onValueChange={(value) => handleInputChange('avg_temperature', value)} placeholder="Select temperature range">
                <SelectContent>
                  <SelectItem value="<15">&lt;15°C</SelectItem>
                  <SelectItem value="15-25">15-25°C</SelectItem>
                  <SelectItem value="26-32">26-32°C</SelectItem>
                  <SelectItem value=">32">&gt;32°C</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="avg_humidity">Average Humidity</Label>
              <Select value={profile.avg_humidity} onValueChange={(value) => handleInputChange('avg_humidity', value)} placeholder="Select humidity range">
                <SelectContent>
                  <SelectItem value="<30">&lt;30%</SelectItem>
                  <SelectItem value="30-60">30-60%</SelectItem>
                  <SelectItem value=">60">&gt;60%</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="typical_environment">Typical Environment</Label>
              <Select value={profile.typical_environment} onValueChange={(value) => handleInputChange('typical_environment', value)} placeholder="Select environment">
                <SelectContent>
                  <SelectItem value="Outdoor">Outdoor</SelectItem>
                  <SelectItem value="Indoor-still">Indoor-still</SelectItem>
                  <SelectItem value="Indoor-AC">Indoor-AC</SelectItem>
                  <SelectItem value="Indoor-ventilated">Indoor-ventilated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-pink-500" />
            <span>Fragrance Preferences</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Preferred Fragrance Families (up to 3)</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
              {fragranceFamilies.map(family => (
                <div key={family} className="flex items-center space-x-2">
                  <Checkbox
                    id={`pref-${family}`}
                    checked={profile.preferred_families.includes(family)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        if (!profile.preferred_families.includes(family) && profile.preferred_families.length < 3) {
                          toggleArrayItem('preferred_families', family)
                        }
                      } else {
                        if (profile.preferred_families.includes(family)) {
                          toggleArrayItem('preferred_families', family)
                        }
                      }
                    }}
                    disabled={!profile.preferred_families.includes(family) && profile.preferred_families.length >= 3}
                  />
                  <Label htmlFor={`pref-${family}`} className="text-sm">{family}</Label>
                </div>
              ))}
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Selected: {profile.preferred_families.length > 0 ? profile.preferred_families.join(', ') : 'None'}
            </div>
          </div>
          
          <div>
            <Label>Disliked Fragrance Families</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
              {fragranceFamilies.map(family => (
                <div key={family} className="flex items-center space-x-2">
                  <Checkbox
                    id={`dislike-${family}`}
                    checked={profile.disliked_families.includes(family)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        if (!profile.disliked_families.includes(family)) {
                          toggleArrayItem('disliked_families', family)
                        }
                      } else {
                        if (profile.disliked_families.includes(family)) {
                          toggleArrayItem('disliked_families', family)
                        }
                      }
                    }}
                  />
                  <Label htmlFor={`dislike-${family}`} className="text-sm">{family}</Label>
                </div>
              ))}
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Selected: {profile.disliked_families.length > 0 ? profile.disliked_families.join(', ') : 'None'}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="preferred_intensity">Preferred Intensity</Label>
              <Select value={profile.preferred_intensity} onValueChange={(value) => handleInputChange('preferred_intensity', value)} placeholder="Select intensity">
                <SelectContent>
                  <SelectItem value="Light">Light (Skin scent)</SelectItem>
                  <SelectItem value="Moderate">Moderate</SelectItem>
                  <SelectItem value="Strong">Strong</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="gender_presentation">Gender Presentation</Label>
              <Select value={profile.gender_presentation} onValueChange={(value) => handleInputChange('gender_presentation', value)} placeholder="Select presentation">
                <SelectContent>
                  <SelectItem value="Feminine">Feminine</SelectItem>
                  <SelectItem value="Masculine">Masculine</SelectItem>
                  <SelectItem value="Unisex">Unisex</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label>Longevity Target: {profile.longevity_target} hours</Label>
            <Slider
              value={[profile.longevity_target]}
              onValueChange={([value]) => handleInputChange('longevity_target', value)}
              max={12}
              min={2}
              step={1}
              className="mt-2"
            />
          </div>
          
          <div>
            <Label>Budget Range: ${profile.budget_min} - ${profile.budget_max}</Label>
            <div className="flex space-x-4 mt-2">
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="Min budget"
                  value={profile.budget_min}
                  onChange={(e) => handleInputChange('budget_min', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="Max budget"
                  value={profile.budget_max}
                  onChange={(e) => handleInputChange('budget_max', parseFloat(e.target.value) || 300)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sensitivities Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span>Sensitivities & Allergies</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Known Allergies/Intolerances</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              {allergens.map(allergen => (
                <div key={allergen} className="flex items-center space-x-2">
                  <Checkbox
                    id={`allergy-${allergen}`}
                    checked={profile.allergies.includes(allergen)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        if (!profile.allergies.includes(allergen)) {
                          toggleArrayItem('allergies', allergen)
                        }
                      } else {
                        if (profile.allergies.includes(allergen)) {
                          toggleArrayItem('allergies', allergen)
                        }
                      }
                    }}
                  />
                  <Label htmlFor={`allergy-${allergen}`} className="text-sm">{allergen}</Label>
                </div>
              ))}
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Selected: {profile.allergies.length > 0 ? profile.allergies.join(', ') : 'None'}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sensitivity_sweetness">Sensitivity to Sweetness</Label>
              <Select value={profile.sensitivity_sweetness} onValueChange={(value) => handleInputChange('sensitivity_sweetness', value)} placeholder="Select sensitivity">
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="self_anosmia_musks">Self-anosmia to Musks</Label>
              <Select value={profile.self_anosmia_musks} onValueChange={(value) => handleInputChange('self_anosmia_musks', value)} placeholder="Select option">
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                  <SelectItem value="Unsure">Unsure</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-green-500" />
            <span>Application Preferences</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Number of Sprays: {profile.number_of_sprays}</Label>
              <Slider
                value={[profile.number_of_sprays]}
                onValueChange={([value]) => handleInputChange('number_of_sprays', value)}
                max={8}
                min={1}
                step={1}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="preferred_concentration">Preferred Concentration</Label>
              <Select value={profile.preferred_concentration} onValueChange={(value) => handleInputChange('preferred_concentration', value)} placeholder="Select concentration">
                <SelectContent>
                  <SelectItem value="EDT">EDT (Eau de Toilette)</SelectItem>
                  <SelectItem value="EDP">EDP (Eau de Parfum)</SelectItem>
                  <SelectItem value="Parfum">Parfum</SelectItem>
                  <SelectItem value="Extrait">Extrait</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="spray_location">Spray Location</Label>
              <Select value={profile.spray_location} onValueChange={(value) => handleInputChange('spray_location', value)} placeholder="Select location">
                <SelectContent>
                  <SelectItem value="Skin only">Skin only</SelectItem>
                  <SelectItem value="Clothes only">Clothes only</SelectItem>
                  <SelectItem value="Mix">Mix (Skin & Clothes)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Decision Window Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-purple-500" />
            <span>Decision Window</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Time Window You Care About: {profile.time_window_start}h - {profile.time_window_end}h</Label>
            <div className="flex space-x-4 mt-2">
              <div className="flex-1">
                <Label className="text-sm">Start (hours)</Label>
                <Slider
                  value={[profile.time_window_start]}
                  onValueChange={([value]) => handleInputChange('time_window_start', value)}
                  max={12}
                  min={0}
                  step={1}
                  className="mt-1"
                />
              </div>
              <div className="flex-1">
                <Label className="text-sm">End (hours)</Label>
                <Slider
                  value={[profile.time_window_end]}
                  onValueChange={([value]) => handleInputChange('time_window_end', value)}
                  max={24}
                  min={1}
                  step={1}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
          
          <div>
            <Label>Projection Weight (λ): {profile.projection_weight.toFixed(1)}</Label>
            <p className="text-sm text-gray-600 mb-2">How much you value sillage vs self-smell</p>
            <Slider
              value={[profile.projection_weight]}
              onValueChange={([value]) => handleInputChange('projection_weight', value)}
              max={2.0}
              min={0.2}
              step={0.1}
              className="mt-2"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>Self-focused</span>
              <span>Balanced</span>
              <span>Projection-focused</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Get Recommendation Button */}
      <div className="flex justify-center">
        <Button 
          size="lg" 
          onClick={getAIRecommendations}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {loading ? 'Finding Matches...' : 'Get Recommendation'}
        </Button>
      </div>

      {/* Recommendations Display */}
      {recommendations.length > 0 && (
        <div className="space-y-4 mt-8">
          <h2 className="text-2xl font-bold text-gray-900">Top 3 Perfume Recommendations</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recommendations.map((rec, index) => (
              <div key={index} className="border rounded-lg p-4 bg-white shadow">
                <div className="font-bold text-lg mb-2">{rec.Brand} - {rec.Name}</div>
                {rec['Image URL'] && <img src={rec['Image URL']} alt={rec.Name} className="w-32 h-32 object-cover rounded mb-2" />}
                <div className="mb-2">{rec['Main Accords'] && rec['Main Accords'].map((acc, i) => (<span key={i} className="inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded mr-2 mb-1">{acc}</span>))}</div>
                <div className="mb-2">{rec.Notes?.Top && <span><strong>Top:</strong> {rec.Notes.Top.map(n => n.Name || n.name || JSON.stringify(n)).join(', ')}</span>}</div>
                <div className="mb-2">{rec.Notes?.Middle && <span><strong>Middle:</strong> {rec.Notes.Middle.map(n => n.Name || n.name || JSON.stringify(n)).join(', ')}</span>}</div>
                <div className="mb-2">{rec.Notes?.Base && <span><strong>Base:</strong> {rec.Notes.Base.map(n => n.Name || n.name || JSON.stringify(n)).join(', ')}</span>}</div>
                {rec.Price && <div className="mb-2"><strong>Price:</strong> ${rec.Price}</div>}
                {rec.Longevity && <div className="mb-2"><strong>Longevity:</strong> {rec.Longevity}</div>}
                {rec.Sillage && <div className="mb-2"><strong>Sillage:</strong> {rec.Sillage}</div>}
                {rec.PurchaseURL && <a href={rec.PurchaseURL} target="_blank" rel="noopener noreferrer" className="text-purple-600 underline">Buy Now</a>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfilePage

