import React, { useEffect, useState } from "react";
import QuestionnairePage from "./QuestionnairePage";
import Chatbox from "./Chatbox"; // UI-only chatbox component

const ProfilePage = ({ userId }) => {
  const [profile, setProfile] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const BASE_API_URL = "http://localhost:8000";

  // Fetch user profile and recommendation
  useEffect(() => {
    fetch(`${BASE_API_URL}/user-profiles/${userId}`)
      .then((res) => (res.status === 404 ? null : res.json()))
      .then((data) => {
        setProfile(data);
        setLoading(false);
        if (data && data.recommendation_id) {
          fetch(`${BASE_API_URL}/recommendations/${data.recommendation_id}`)
            .then((res) => res.json())
            .then((rec) => setRecommendation(rec));
        }
      })
      .catch(() => setLoading(false));
  }, [userId]);

  // Handler for when profile is created/updated via questionnaire
  const handleProfileCreated = (newProfile) => {
    setProfile(newProfile);
    setEditing(false);
    // Fetch recommendation if available
    if (newProfile && newProfile.recommendation_id) {
      fetch(
        `http://localhost:8000/api/recommendations/${newProfile.recommendation_id}`
      )
        .then((res) => res.json())
        .then((rec) => setRecommendation(rec));
    }
  };

  if (loading) return <div>Loading...</div>;

  // Show questionnaire if no profile or editing
  if (!profile || editing) {
    return (
      <div>
        <QuestionnairePage
          userId={userId}
          onProfileCreated={handleProfileCreated}
        />
        <div style={{ marginTop: "2em" }}>
          <Chatbox />
        </div>
      </div>
    );
  }

  // Show profile, recommendation, and update option
  return (
    <div>
      <h2>Your Profile</h2>
      <ul>
        {Object.entries(profile).map(([k, v]) =>
          k !== "recommendation_id" ? (
            <li key={k}>
              <b>{k.replace(/_/g, " ")}:</b> {v}
            </li>
          ) : null
        )}
      </ul>
      <button onClick={() => setEditing(true)} style={{ margin: "1em 0" }}>
        Update Profile
      </button>
      <h3>Your Recommendation</h3>
      {recommendation ? (
        <div
          style={{
            border: "1px solid #ccc",
            padding: "1em",
            marginBottom: "2em",
          }}
        >
          <b>Perfume:</b> {recommendation.perfume_name || recommendation.name}{" "}
          <br />
          <b>Brand:</b> {recommendation.brand} <br />
          <b>Notes:</b> {recommendation.notes || "-"}
        </div>
      ) : (
        <div>No recommendation yet.</div>
      )}
      <Chatbox />
    </div>
  );
};

export default ProfilePage;
