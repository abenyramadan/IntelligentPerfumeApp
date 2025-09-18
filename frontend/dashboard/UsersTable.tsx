import React, { useState, useEffect } from "react";

interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

const getAvatar = (username: string) =>
  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(username)}&backgroundColor=ece9fe,fae8ff`;

const UsersTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/users/')
      .then(response => response.json())
      .then(data => {
        setUsers(Array.isArray(data.data) ? data.data : []);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading Users...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Users</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {users.map(user => (
          <div
            key={user.id}
            className="bg-white/90 rounded-2xl shadow-lg border border-purple-100 p-6 flex flex-col items-center hover:shadow-2xl transition"
          >
            <img
              src={getAvatar(user.username)}
              alt={user.username}
              className="w-16 h-16 rounded-full mb-3 border-2 border-purple-100 shadow"
            />
            <div className="text-lg font-semibold text-purple-700">{user.username}</div>
            <div className="text-gray-500 text-sm mb-2">{user.email}</div>
            <div className="text-xs text-gray-400 mt-auto">
              Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersTable;