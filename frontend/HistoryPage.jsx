import React from 'react';
import Layout from './Layout';
import RecommendationHistory from './RecommendationHistory';

const HistoryPage = ({ user }) => {
  return (
    <Layout onLogout={() => {}} user={user}>
      <RecommendationHistory
        userId={user?.id || 1}
        showAsPage={true}
      />
    </Layout>
  );
};

export default HistoryPage;

