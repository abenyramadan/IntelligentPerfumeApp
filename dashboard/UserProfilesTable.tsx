import React, { useEffect, useState } from "react";

interface UserProfile {
  id: number;
  user_id: number;
  skin_type: string;
  primary_climate: string;
  preferred_families: string;
  allergies: string;
  budget_max: number;
  created_at?: string;
  // Add more fields as needed
}

const UserProfilesTable: React.FC = () => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/user-profiles')
      .then(res => res.json())
      .then(data => {
        setProfiles(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading user profiles...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">User Profiles</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">User ID</th>
            <th className="py-2 px-4 border-b">Skin Type</th>
            <th className="py-2 px-4 border-b">Primary Climate</th>
            <th className="py-2 px-4 border-b">Preferred Families</th>
            <th className="py-2 px-4 border-b">Allergies</th>
            <th className="py-2 px-4 border-b">Budget Max</th>
            <th className="py-2 px-4 border-b">Created At</th>
          </tr>
        </thead>
        <tbody>
          {profiles.map(profile => (
            <tr key={profile.id}>
              <td className="py-2 px-4 border-b">{profile.id}</td>
              <td className="py-2 px-4 border-b">{profile.user_id}</td>
              <td className="py-2 px-4 border-b">{profile.skin_type}</td>
              <td className="py-2 px-4 border-b">{profile.primary_climate}</td>
              <td className="py-2 px-4 border-b">{profile.preferred_families}</td>
              <td className="py-2 px-4 border-b">{profile.allergies}</td>
              <td className="py-2 px-4 border-b">{profile.budget_max}</td>
              <td className="py-2 px-4 border-b">{profile.created_at ? new Date(profile.created_at).toLocaleDateString() : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default UserProfilesTable;