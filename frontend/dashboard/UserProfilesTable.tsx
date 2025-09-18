import React, { useEffect, useState } from "react";

interface UserProfile {
  id: string;
  user_id: string;
  skin_type: string;
  skin_ph: string;
  preferred_families: string;
  disliked_families: string;
  seasonal_focus: string;
  created_at?: string;
}

const UserProfilesTable: React.FC = () => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = () => {
    fetch("http://localhost:8000/profiles/")
      .then((res) => res.json())
      .then((data) => {
        setProfiles(
          Array.isArray(data.data)
            ? data.data
            : Array.isArray(data)
            ? data
            : []
        );
        setLoading(false);
      })
      .catch(() => {
        setProfiles([]);
        setLoading(false);
      });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/profiles/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProfiles(profiles.filter((p) => p.id !== id));
      } else {
        alert("Failed to delete user");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting user");
    }
  };

  const handleEdit = async (profile: UserProfile) => {
    alert("Edit functionality not implemented. Add fields to interface and backend if needed.");
  };

  if (loading) return <div>Loading user profiles...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">User Profiles</h2>
      
      {profiles.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          No user profiles found.
        </div>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full bg-white border-collapse">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "ID",
                  "User ID",
                  "Skin Type",
                  "Skin pH",
                  "Preferred Families",
                  "Disliked Families",
                  "Seasonal Focus",
                  "Created At",
                  "Actions"
                ].map((header) => (
                  <th 
                    key={header} 
                    className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {profiles.map((profile) => (
                <tr key={profile.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">{profile.id}</td>
                  <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">{profile.user_id}</td>
                  <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">{profile.skin_type}</td>
                  <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">{profile.skin_ph}</td>
                  <td className="py-3 px-4 text-sm text-gray-700 max-w-xs truncate">{profile.preferred_families}</td>
                  <td className="py-3 px-4 text-sm text-gray-700 max-w-xs truncate">{profile.disliked_families}</td>
                  <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">{profile.seasonal_focus}</td>
                  <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">
                    {profile.created_at
                      ? new Date(profile.created_at).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(profile)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-colors text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(profile.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserProfilesTable;