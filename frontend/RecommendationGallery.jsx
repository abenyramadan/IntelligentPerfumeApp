import React from "react";

const RecommendationGallery = ({ recommendation }) => {
  console.log('RecommendationGallery received:', recommendation);

  if (!recommendation) {
    return null;
  }

  // Handle different response structures
  const main = recommendation.data && recommendation.data[0] ? recommendation.data[0] : recommendation;
  const otherPerfumes = main.other_perfumes_to_try || [];

  // Map database fields to expected frontend fields
  const mappedMain = {
    ...main,
    perfume: main.ai_perfume_name || main.perfume || main.name || 'Unknown Perfume',
    image_url: main.image_url || "https://via.placeholder.com/300x200?text=" + encodeURIComponent(main.perfume || 'Unknown'),
    predicted_longevity: main.predicted_longevity,
    predicted_projection: main.predicted_projection,
    predicted_sillage: main.predicted_sillage,
    utility_score: main.utility_score,
    price: main.price,
    reason: main.reason,
    other_perfumes_to_try: main.other_perfumes_to_try || []
  };

  console.log('Main recommendation:', main);

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
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <img
              className="h-48 w-full object-cover rounded-lg"
              src={mappedMain.image_url}
              alt={mappedMain.perfume}
            />
          </div>
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
              <p className="mb-2">
                <span className="font-semibold">Utility Score:</span> {mappedMain.utility_score}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Other Recommendations */}
      {mappedMain.other_perfumes_to_try && mappedMain.other_perfumes_to_try.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">Other Perfumes to Try</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mappedMain.other_perfumes_to_try.map((perfume, idx) => (
              <div key={perfume.name || idx} className="text-center border rounded-lg p-4 hover:shadow-lg transition-shadow">
                <img
                  className="h-32 w-full object-cover rounded-lg mb-2"
                  src={perfume.image_url || "https://via.placeholder.com/150x100?text=" + encodeURIComponent(perfume.name || 'Perfume')}
                  alt={perfume.name || 'Perfume'}
                />
                <p className="font-semibold text-sm mb-1">{perfume.name || 'Unknown Perfume'}</p>
                {perfume.price && (
                  <p className="text-gray-600 font-medium">${perfume.price.toFixed(2)}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationGallery;
