import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LikeDislikeButtons from "./components/LikeDislikeButtons";
import FeedbackModal from "./components/FeedbackModal";
import StarRating from "./components/StarRating";

const RecommendationGallery = ({ recommendation }) => {
  const navigate = useNavigate();
  console.log('RecommendationGallery received:', recommendation);

  const [imageUrls, setImageUrls] = useState({});
  const [loadingImages, setLoadingImages] = useState({});
  const [imageErrors, setImageErrors] = useState({});

  // Feedback state
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedPerfumeForFeedback, setSelectedPerfumeForFeedback] = useState(null);
  const [existingFeedback, setExistingFeedback] = useState({});

  const handleImageError = (perfumeName) => {
    setImageErrors(prev => ({ ...prev, [perfumeName]: true }));
  };

  // Feedback handlers
  const handleLikeRecommendation = async (recommendationId, liked) => {
    if (!recommendationId) {
      console.error('❌ No recommendation ID provided');
      return;
    }

    try {
      const BASE_API_URL = "http://localhost:8000";
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = user.token;

      if (!token) {
        console.error('❌ No authentication token found');
        return;
      }

      const response = await fetch(`${BASE_API_URL}/feedback/recommendation/${recommendationId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          liked: liked,
          context_mood: 'neutral', // Could be expanded to track user mood
          context_activity: 'browsing'
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Like/dislike submitted:', data);
        // Update the recommendation data if needed
      } else {
        console.error('❌ Failed to submit like/dislike');
      }
    } catch (error) {
      console.error('❌ Error submitting like/dislike:', error);
    }
  };

  const handleRemoveLike = async (recommendationId) => {
    if (!recommendationId) {
      console.error('❌ No recommendation ID provided');
      return;
    }

    try {
      const BASE_API_URL = "http://localhost:8000";
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = user.token;

      if (!token) {
        console.error('❌ No authentication token found');
        return;
      }

      const response = await fetch(`${BASE_API_URL}/feedback/recommendation/${recommendationId}/like`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        console.log('✅ Like/dislike removed');
      } else {
        console.error('❌ Failed to remove like/dislike');
      }
    } catch (error) {
      console.error('❌ Error removing like/dislike:', error);
    }
  };

  const handleFeedbackSubmit = async (perfumeData, feedbackData) => {
    console.log('🎯 handleFeedbackSubmit called with:', {
      perfumeData,
      feedbackData
    });

    try {
      const BASE_API_URL = "http://localhost:8000";
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = user.token;

      console.log('🔑 Auth token available:', !!token);

      if (!token) {
        console.error('❌ No authentication token found');
        return;
      }

      const payload = {
        ...feedbackData,
        ai_perfume_name: perfumeData.ai_perfume_name || perfumeData.name,
        perfume_id: perfumeData.perfume_id || null,
        context_mood: 'neutral',
        context_activity: 'reviewing recommendation'
      };

      // Filter out empty datetime fields to prevent validation errors
      Object.keys(payload).forEach(key => {
        if ((key.includes('date') || key.includes('Date')) && (!payload[key] || payload[key] === '')) {
          delete payload[key];
        }
      });

      console.log('📤 Submitting feedback with payload:', payload);

      const response = await fetch(`${BASE_API_URL}/feedback/perfume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      console.log('📡 API Response status:', response.status);
      console.log('📡 API Response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Feedback submitted successfully:', data);
        setExistingFeedback(prev => ({
          ...prev,
          [perfumeData.name || perfumeData.ai_perfume_name]: data.data
        }));
      } else {
        const errorText = await response.text();
        console.error('❌ Feedback submission failed:', {
          status: response.status,
          statusText: response.statusText,
          responseBody: errorText
        });
      }
    } catch (error) {
      console.error('❌ Error submitting feedback:', error);
    }
  };

  const openFeedbackModal = (perfume) => {
    setSelectedPerfumeForFeedback(perfume);
    setFeedbackModalOpen(true);
  };

  if (!recommendation) {
    return null;
  }

  const main = recommendation.data && recommendation.data[0] ? recommendation.data[0] : recommendation;

  // Map database fields to expected frontend fields
  const originalPerfumeName = main.ai_perfume_name || main.perfume || main.name || 'Unknown Perfume';
  const displayPerfumeName = originalPerfumeName
    .replace(/^Test Perfume \d+$/, 'Recommended Perfume')
    .replace(/^Unknown Perfume$/, 'Recommended Perfume');

  const mappedMain = {
    ...main,
    perfume: displayPerfumeName,
    image_url: imageUrls[originalPerfumeName] || main.image_url,
    predicted_longevity: main.predicted_longevity,
    predicted_projection: main.predicted_projection,
    predicted_sillage: main.predicted_sillage,
    utility_score: main.utility_score,
    price: main.price,
    reason: main.reason,
    other_perfumes_to_try: main.other_perfumes_to_try || []
  };

  // Filter out test perfumes and empty entries
  const filteredOtherPerfumes = mappedMain.other_perfumes_to_try.filter(perfume => {
    const name = perfume.name || '';
    return name.trim() !== '' &&
           !name.toLowerCase().includes('test') &&
           !name.toLowerCase().includes('unknown');
  });

  // Fetch image from Fragella API if not already cached
  const fetchFragellaImage = async (perfumeName) => {
    if (imageUrls[perfumeName] || loadingImages[perfumeName]) {
      return; // Already have image or currently loading
    }

    setLoadingImages(prev => ({ ...prev, [perfumeName]: true }));

    try {
      const BASE_API_URL = "http://localhost:8000";
      const response = await fetch(`${BASE_API_URL}/ai/perfume-image/${encodeURIComponent(perfumeName)}`);

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data && data.data[0] && data.data[0].image_url) {
          // Preload the image before setting state
          const img = new Image();
          img.src = data.data[0].image_url;
          
          img.onload = () => {
            setImageUrls(prev => ({
              ...prev,
              [perfumeName]: data.data[0].image_url
            }));
          };
          
          img.onerror = () => {
            console.log(`❌ Image failed to load: ${data.data[0].image_url}`);
            handleImageError(perfumeName);
          };
        } else {
          handleImageError(perfumeName);
        }
      } else {
        handleImageError(perfumeName);
      }
    } catch (error) {
      console.error(`❌ Error fetching image for ${perfumeName}:`, error);
      handleImageError(perfumeName);
    } finally {
      setLoadingImages(prev => ({ ...prev, [perfumeName]: false }));
    }
  };

  // Fetch images for main perfume and alternatives on component mount
  useEffect(() => {
    // Always try to get Fragella images since AI-generated URLs are unreliable

    // Fetch main perfume image
    if (originalPerfumeName && originalPerfumeName !== 'Unknown Perfume') {
      fetchFragellaImage(originalPerfumeName);
    }

    // Fetch images for alternative perfumes
    mappedMain.other_perfumes_to_try.forEach((perfume, index) => {
      if (perfume.name) {
        fetchFragellaImage(perfume.name);
      }
    });
  }, [originalPerfumeName, mappedMain.other_perfumes_to_try]);

  console.log('Main recommendation:', main);
  console.log('Main ID:', main?.id);

  if (!mappedMain || !mappedMain.perfume || mappedMain.perfume === 'Unknown Perfume') {
    return (
      <div className="text-center p-8">
        <div className="text-6xl mb-4">💭</div>
        <h4 className="text-xl font-semibold mb-2">No recommendation yet</h4>
        <p className="text-gray-600">Complete your profile to get personalized fragrance recommendations</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Main Recommendation */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="flex flex-col md:flex-row">
          {/* Main Perfume Image */}
          <div className="md:w-2/5 lg:w-1/3 bg-gradient-to-br from-purple-50 to-pink-50 p-6 flex items-center justify-center min-h-[320px]">
            <div className="relative w-full h-full max-h-[280px] flex items-center justify-center">
              {imageUrls[originalPerfumeName] ? (
                <div className="w-full h-full flex items-center justify-center">
                  <img
                    className="h-full w-auto max-w-full object-contain transition-all duration-300 hover:scale-105"
                    src={imageUrls[originalPerfumeName]}
                    alt={mappedMain.perfume}
                    loading="lazy"
                    onLoad={() => console.log(`✅ Image loaded successfully for ${originalPerfumeName}`)}
                    onError={(e) => {
                      console.error(`❌ Image failed to load for ${originalPerfumeName}:`, e.target.src);
                      handleImageError(originalPerfumeName);
                    }}
                    style={{
                      maxHeight: '100%',
                      objectFit: 'contain',
                      objectPosition: 'center',
                    }}
                  />
                  {loadingImages[originalPerfumeName] && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent"></div>
                    </div>
                  )}
                </div>
              ) : imageErrors[originalPerfumeName] ? (
                <div className="flex flex-col items-center justify-center p-6 text-center">
                  <div className="text-6xl mb-2 text-gray-300">🫧</div>
                  <div className="text-sm text-gray-400 font-medium">No Image Available</div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent"></div>
                </div>
              )}
            </div>
          </div>
          
          {/* Perfume Details */}
          <div className="p-6 md:w-3/5 lg:w-2/3">
          <div className="md:w-2/3">
            <h2 className="text-2xl font-bold mb-3">{mappedMain.perfume}</h2>
            <p className="text-gray-700 mb-4">{mappedMain.reason}</p>

            {/* Price for main recommendation */}
            {mappedMain.price && (
              <p className="text-2xl font-bold text-blue-600 mb-4">
                ${mappedMain.price.toFixed(2)}
              </p>
            )}

            {/* Additional details if available */}
            {mappedMain.predicted_longevity && (
              <p className="mb-2">
                <span className="font-semibold">Longevity:</span> {mappedMain.predicted_longevity} hours
              </p>
            )}
            {mappedMain.predicted_projection && (
              <p className="mb-2">
                <span className="font-semibold">Projection:</span> {mappedMain.predicted_projection}/10
              </p>
            )}
            {mappedMain.predicted_sillage && (
              <p className="mb-2">
                <span className="font-semibold">Sillage:</span> {mappedMain.predicted_sillage}/10
              </p>
            )}
            {mappedMain.utility_score && (
              <p className="mb-4">
                <span className="font-semibold">Utility Score:</span> {mappedMain.utility_score}
              </p>
            )}

            {/* Like/Dislike and Feedback Actions */}
            <div className="flex flex-col gap-3 mt-6 pt-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
                <LikeDislikeButtons
                  liked={main.user_liked}
                  onLike={() => main.id && handleLikeRecommendation(main.id, true)}
                  onDislike={() => main.id && handleLikeRecommendation(main.id, false)}
                  onRemove={() => main.id && handleRemoveLike(main.id)}
                  size="sm"
                />
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => openFeedbackModal({
                      name: originalPerfumeName,
                      ai_perfume_name: main.ai_perfume_name,
                      perfume_id: main.perfume_id
                    })}
                    className="px-3 py-2 sm:px-4 sm:py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    💬 Share Feedback
                  </button>
                  <button
                    onClick={() => navigate('/liked-perfumes')}
                    className="px-3 py-2 sm:px-4 sm:py-2 text-sm bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                    title="View your liked perfumes"
                  >
                    💖 Liked Perfumes
                  </button>
                </div>
              </div>

              {/* Display existing rating if available */}
              {main.user_rating && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Your Rating:</span>
                  <StarRating rating={main.user_rating} disabled size="sm" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Other Recommendations */}
      {filteredOtherPerfumes && filteredOtherPerfumes.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 mt-8">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-bold text-gray-800">Other Perfumes to Try</h3>
            <p className="text-gray-500 text-sm mt-1">You might also enjoy these similar fragrances</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredOtherPerfumes.map((perfume, idx) => {
              const isLoading = loadingImages[perfume.name];
              const hasError = imageErrors[perfume.name];
              const hasImage = imageUrls[perfume.name];

              return (
                <div key={perfume.name || idx} className="group bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="relative h-48 w-full bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
                    {hasImage ? (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <img
                          className="h-full w-auto max-w-full object-contain transition-all duration-300 group-hover:scale-105"
                          src={imageUrls[perfume.name]}
                          alt={perfume.name}
                          loading="lazy"
                          onError={(e) => {
                            console.error(`Image failed to load for ${perfume.name}:`, e.target.src);
                            handleImageError(perfume.name);
                          }}
                          style={{
                            maxHeight: '100%',
                            objectFit: 'contain',
                            objectPosition: 'center',
                          }}
                        />
                        {isLoading && (
                          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-500 border-t-transparent"></div>
                          </div>
                        )}
                      </div>
                    ) : hasError || !isLoading ? (
                      <div className="flex flex-col items-center justify-center p-4 text-center">
                        <div className="text-5xl mb-2 text-gray-300">🫧</div>
                        <div className="text-xs text-gray-400 font-medium">No Image</div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-500 border-t-transparent"></div>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-800 text-center">{perfume.name}</h4>
                    {perfume.reason && (
                      <p className="text-xs text-gray-500 mt-2 text-center line-clamp-2">
                        {perfume.reason}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => {
          setFeedbackModalOpen(false);
          setSelectedPerfumeForFeedback(null);
        }}
        perfumeName={selectedPerfumeForFeedback?.name || selectedPerfumeForFeedback?.ai_perfume_name || 'Unknown Perfume'}
        onSubmit={(feedbackData) => handleFeedbackSubmit(selectedPerfumeForFeedback, feedbackData)}
        initialData={existingFeedback[selectedPerfumeForFeedback?.name || selectedPerfumeForFeedback?.ai_perfume_name] || {}}
      />
    </div>

    </div>
    )};

export default RecommendationGallery;
