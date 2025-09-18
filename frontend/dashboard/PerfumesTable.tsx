import React, { useEffect, useState } from "react";

interface Perfume {
  id: string;
  name: string;
  brand: string;
  top_notes: string;
  fragrance_families: string;
  gender_presentation: string;
  image_url: string;
  middle_notes: string;
  base_notes: string;
  seasonal_focus: string;
  created_at?: string;
}

const PerfumesTable: React.FunctionComponent = () => {
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/perfumes/')
      .then(res => res.json())
      .then(data => {
        setPerfumes(Array.isArray(data.data) ? data.data : []);
        setLoading(false);
        // Debug: log the first perfume object
        if (Array.isArray(data.data) && data.data.length > 0) {
          console.log("First perfume object:", data.data[0]);
        }
      })
      .catch(() => {
        setPerfumes([]);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading perfumes...</div>;

  // Helper to safely render notes as string
  const renderNotes = (notes: string | string[] | undefined) => {
    if (!notes) return "";
    if (Array.isArray(notes)) return notes.join(", ");
    if (typeof notes === "string") return notes;
    return JSON.stringify(notes);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Perfumes</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Brand</th>
            <th className="py-2 px-4 border-b">Notes</th>
            <th className="py-2 px-4 border-b">Created At</th>
          </tr>
        </thead>
        <tbody>
          {perfumes.map(perfume => (
            <tr key={perfume.id}>
              <td className="py-2 px-4 border-b">{perfume.id}</td>
              <td className="py-2 px-4 border-b">{perfume.name}</td>
              <td className="py-2 px-4 border-b">{perfume.brand}</td>
              <td className="py-2 px-4 border-b">
                {[
                  renderNotes(perfume.top_notes),
                  renderNotes(perfume.middle_notes), // <-- fixed typo
                  renderNotes(perfume.base_notes),
                ]
                  .filter(Boolean)
                  .join(" / ")}
              </td>
              <td className="py-2 px-4 border-b">
                {perfume.created_at ? new Date(perfume.created_at).toLocaleDateString() : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PerfumesTable;