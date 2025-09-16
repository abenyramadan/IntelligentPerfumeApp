import React, { useEffect, useState } from "react";

interface Recommendation {
  id: string;
  user_id: string;
  perfume_name: string;
  user_notes: string;
  context_mood: string;
  created_at?: string;
}

const RecommendationsTable: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = () => {
    fetch("http://127.0.0.1:8000/recommendations/")
      .then((res) => res.json())
      .then((data) => {
        setRecommendations(
          Array.isArray(data.data)
            ? data.data
            : Array.isArray(data)
            ? data
            : []
        );
        setLoading(false);
      })
      .catch(() => {
        setRecommendations([]);
        setLoading(false);
      });
  };

  // Delete recommendation
  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this recommendation?")) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/recommendations/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setRecommendations(recommendations.filter((r) => r.id !== id));
      } else {
        alert("Failed to delete recommendation");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting recommendation");
    }
  };

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
            <th className="py-2 px-4 border-b">Created At</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {recommendations.map((rec) => (
            <tr key={rec.id}>
              <td className="py-2 px-4 border-b">{rec.id}</td>
              <td className="py-2 px-4 border-b">{rec.user_id}</td>
              <td className="py-2 px-4 border-b">{rec.perfume_name}</td>
              <td className="py-2 px-4 border-b">
                {rec.created_at
                  ? new Date(rec.created_at).toLocaleDateString()
                  : "-"}
              </td>
              <td className="py-2 px-4 border-b space-x-2">
                {/* You can add edit functionality for other fields if needed */}
                <button
                  onClick={() => handleDelete(rec.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecommendationsTable;
