import React, { useEffect, useState } from "react";

interface Question {
  question_id: string;
  question_text: string;
  question_topic: string;
  multiple_choices: string;
  type: string;
  can_select_multiple: string;
}

const QuestionnairesTable: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/questionnaires/questions/")
      .then(res => res.json())
      .then(data => {
        // if your backend returns { success, data: [] }
        setQuestions(Array.isArray(data.data) ? data.data : []);
        setLoading(false);
      })
      .catch(() => {
        setQuestions([]); // fallback
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading questions...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Questionnaires</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Question</th>
            <th className="py-2 px-4 border-b">Topic</th>
            <th className="py-2 px-4 border-b">Choices</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q, idx) => (
            <tr key={q.question_id}>
              <td className="py-2 px-4 border-b">{q.question_id}</td>
              <td className="py-2 px-4 border-b">{q.question_text}</td>
              <td className="py-2 px-4 border-b">{q.question_topic}</td>
              <td className="py-2 px-4 border-b">
                {q.multiple_choices}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionnairesTable;
