import React, { useEffect, useState } from "react";

interface Recommendation {
  id: number;
  user_id: number;
  perfume_name: string;
  brand: string;
  score?: number;
  created_at?: string;
  // Add more fields as needed
}

const RecommendationsTable: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/recommendations')
      .then(res => res.json())
      .then(data => {
        setRecommendations(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading recommendations...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Recommendations</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">User ID</th>
            <th className="py-2 px-4 border-b">Perfume Name</th>
            <th className="py-2 px-4 border-b">Brand</th>
            <th className="py-2 px-4 border-b">Score</th>
            <th className="py-2 px-4 border-b">Created At</th>
          </tr>
        </thead>
        <tbody>
          {recommendations.map(rec => (
            <tr key={rec.id}>
              <td className="py-2 px-4 border-b">{rec.id}</td>
              <td className="py-2 px-4 border-b">{rec.user_id}</td>
              <td className="py-2 px-4 border-b">{rec.perfume_name}</td>
              <td className="py-2 px-4 border-b">{rec.brand}</td>
              <td className="py-2 px-4 border-b">{rec.score ?? '-'}</td>
              <td className="py-2 px-4 border-b">{rec.created_at ? new Date(rec.created_at).toLocaleDateString() : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecommendationsTable;