import React, { useEffect, useState } from "react";

interface Response {
  id: number;
  user_id: number;
  questionnaire_id: number;
  answers: string;
  created_at?: string;
  // Add more fields as needed
}

const ResponsesTable: React.FC = () => {
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/responses')
      .then(res => res.json())
      .then(data => {
        setResponses(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading responses...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Responses</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">User ID</th>
            <th className="py-2 px-4 border-b">Questionnaire ID</th>
            <th className="py-2 px-4 border-b">Answers</th>
            <th className="py-2 px-4 border-b">Created At</th>
          </tr>
        </thead>
        <tbody>
          {responses.map(r => (
            <tr key={r.id}>
              <td className="py-2 px-4 border-b">{r.id}</td>
              <td className="py-2 px-4 border-b">{r.user_id}</td>
              <td className="py-2 px-4 border-b">{r.questionnaire_id}</td>
              <td className="py-2 px-4 border-b">{r.answers}</td>
              <td className="py-2 px-4 border-b">{r.created_at ? new Date(r.created_at).toLocaleDateString() : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default ResponsesTable;