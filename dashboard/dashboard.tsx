import React, { useState } from 'react';
import UsersTable from './UsersTable';
import QuestionnairesTable from './QuestionnairesTable';
import ResponsesTable from './ResponsesTable';
import UserProfilesTable from './UserProfilesTable';
import RecommendationsTable from './RecommendationsTable';


const Dashboard: React.FC = () => {
  const [tab, setTab] = useState<'users' | 'questionnaires' | 'responses' | 'profiles' | 'recommendations' >('users');

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <div className="flex space-x-4 mb-6">
        <button onClick={() => setTab('users')} className={tab === 'users' ? 'font-bold underline' : ''}>Users</button>
        <button onClick={() => setTab('questionnaires')} className={tab === 'questionnaires' ? 'font-bold underline' : ''}>Questionnaires</button>
        <button onClick={() => setTab('responses')} className={tab === 'responses' ? 'font-bold underline' : ''}>Responses</button>
        <button onClick={() => setTab('profiles')} className={tab === 'profiles' ? 'font-bold underline' : ''}>User Profiles</button>
        <button onClick={() => setTab('recommendations')} className={tab === 'recommendations' ? 'font-bold underline' : ''}>Recommendations</button>
      </div>
      <div>
        {tab === 'users' && <UsersTable />}
        {tab === 'questionnaires' && <QuestionnairesTable />}
        {tab === 'responses' && <ResponsesTable />}
        {tab === 'profiles' && <UserProfilesTable />}
        {tab === 'recommendations' && <RecommendationsTable />}
      </div>
    </div>
  );
};

export default Dashboard;
