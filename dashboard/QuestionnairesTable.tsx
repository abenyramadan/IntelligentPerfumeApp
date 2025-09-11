import React, { useEffect, useState } from "react";

interface Questionnaire {
  id: number;
  title: string;
  description: string;
  created_at?: string;
  // Add more fields as needed
}

const QuestionnairesTable: React.FC = () => {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/questionnaires')
      .then(res => res.json())
      .then(data => {
        setQuestionnaires(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading questionnaires...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Questionnaires</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Title</th>
            <th className="py-2 px-4 border-b">Description</th>
            <th className="py-2 px-4 border-b">Created At</th>
          </tr>
        </thead>
        <tbody>
          {questionnaires.map(q => (
            <tr key={q.id}>
              <td className="py-2 px-4 border-b">{q.id}</td>
              <td className="py-2 px-4 border-b">{q.title}</td>
              <td className="py-2 px-4 border-b">{q.description}</td>
              <td className="py-2 px-4 border-b">{q.created_at ? new Date(q.created_at).toLocaleDateString() : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default QuestionnairesTable;