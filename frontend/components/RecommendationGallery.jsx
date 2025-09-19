import React from "react";

const RecommendationGallery = ({ recommendation }) => {
  if (!recommendation || !recommendation.data || !recommendation.data[0]) return null;

  const main = recommendation.data[0];
  const otherPerfumes = main.other_perfumes_to_try || [];
  const otherDescriptions = main.other_perfume_descriptions || []; // Add this if your API provides descriptions
  const otherImages = main.other_images || []; // If you have image URLs for others

  return (
    <div className="grid gap-4">
      <div>
        <img
          className="h-auto max-w-full rounded-lg"
          src={main.image_url || "https://via.placeholder.com/150?text=" + encodeURIComponent(main.perfume)}
          alt={main.perfume}
        />
        <h2 className="mt-2 text-xl font-bold">{main.perfume}</h2>
        <p className="mt-2 text-gray-700">{main.reason}</p>
        {main.price && (
          <p className="mt-2 text-gray-900 font-semibold">Price: ${main.price}</p>
        )}
        {main.base_notes && (
          <p className="mt-2 text-gray-700">
            <span className="font-semibold">Base Notes:</span> {Array.isArray(main.base_notes) ? main.base_notes.join(", ") : main.base_notes}
          </p>
        )}
        {main.preference_families && (
          <p className="mt-2 text-gray-700">
            <span className="font-semibold">Preference Families:</span> {Array.isArray(main.preference_families) ? main.preference_families.join(", ") : main.preference_families}
          </p>
        )}
      </div>
      <div className={`grid grid-cols-${otherPerfumes.length} gap-4`}>
        {otherPerfumes.map((name, idx) => (
          <div key={name}>
            <img
              className="h-auto max-w-full rounded-lg"
              src={otherImages[idx] || "https://via.placeholder.com/150?text=" + encodeURIComponent(name)}
              alt={name}
            />
            <p className="mt-1 text-sm text-center font-semibold">{name}</p>
            <p className="mt-1 text-xs text-center text-gray-600">
              {otherDescriptions[idx] || "No description available."}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const App = ({ recommendation }) => {
  return (
    <div>
      {recommendation && recommendation.data && recommendation.data.length > 0 ? (
        <RecommendationGallery recommendation={recommendation} />
      ) : (
        <div className="no-recommendation">
          <div className="no-recommendation-icon">💭</div>
          <div className="no-recommendation-text">
            <h4>No recommendation yet</h4>
            <p>Complete your profile to get personalized fragrance recommendations</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;