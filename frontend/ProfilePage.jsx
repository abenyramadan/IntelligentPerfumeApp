import React, { useEffect, useState } from "react";
import QuestionnairePage from "./QuestionnairePage";

const getCurrentUserId = () => {
  try {
    const u = JSON.parse(localStorage.getItem("user"));
    return u?.user_id || null;
  } catch {
    return null;
  }
};

const ProfilePage = ({ userId }) => {
  const resolvedUserId = userId || getCurrentUserId();
  const [profile, setProfile] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const BASE_API_URL = "http://localhost:8000";

  useEffect(() => {
    if (!resolvedUserId) return;

    // Try to fetch the user's profile
    fetch(`${BASE_API_URL}/profiles/${resolvedUserId}`)
      .then((res) => (res.status === 404 ? null : res.json()))
      .then((data) => {
        setProfile(data);
        setLoading(false);
        if (data?.recommendation_id) {
          fetch(`${BASE_API_URL}/recommendations/${data.recommendation_id}`)
            .then((res) => res.json())
            .then((rec) => setRecommendation(rec));
        }
      })
      .catch(() => setLoading(false));
  }, [resolvedUserId]);

  // Called after questionnaire is submitted and profile is created
  const handleProfileCreated = (newProfile) => {
    setProfile(newProfile);
    setEditing(false);

    if (newProfile?.recommendation_id) {
      fetch(`${BASE_API_URL}/recommendations/${newProfile.recommendation_id}`)
        .then((res) => res.json())
        .then((rec) => setRecommendation(rec));
    }
  };

  if (loading) return <div>Loading...</div>;

  // If no profile exists or editing, show questionnaire
  if (
    editing ||
    !profile ||
    profile?.message?.toLowerCase().includes("cannot find user profile")
  ) {
    return (
      <div>
        <QuestionnairePage
          userId={resolvedUserId}
          onProfileCreated={handleProfileCreated}
        />
      </div>
    );
  }

  // Only show profile and recommendation if profile exists
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
      {/* <Chatbox /> */}
    </div>
  );
};

export default ProfilePage;
