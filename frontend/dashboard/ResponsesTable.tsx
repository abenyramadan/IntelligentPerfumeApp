import React, { useState, useEffect } from "react";

interface QuestionnaireResponse {
  id: string;
  user_id: string;
  question_id: string;
  answer_text: string;
  answer_number: string;
  answer_json: string;
  createdAt: string;
}

const ResponsesTable: React.FC = () => {
  const [responses, setResponses] = useState<QuestionnaireResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/questionnaires/responses/')
      .then(response => response.json())
      .then(data => {
        setResponses(Array.isArray(data.data) ? data.data : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching questionnaire responses:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading Questionnaire Responses...</div>;
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Questionnaire Responses</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">User ID</th>
            <th className="py-2 px-4 border-b">Question ID</th>
            <th className="py-2 px-4 border-b">Answer</th>
            <th className="py-2 px-4 border-b">Created At</th>
          </tr>
        </thead>
        <tbody>
          {responses.map(resp => (
            <tr key={resp.id}>
              <td className="py-2 px-4 border-b">{resp.id}</td>
              <td className="py-2 px-4 border-b">{resp.user_id}</td>
              <td className="py-2 px-4 border-b">{resp.question_id}</td>
              <td className="py-2 px-4 border-b">{resp.answer_text}</td>
              <td className="py-2 px-4 border-b">{resp.createdAt ? new Date(resp.createdAt).toLocaleDateString() : ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResponsesTable;