import React, { useEffect, useState } from "react";
import QuestionnairePage from "./QuestionnairePage";
import RecommendationGallery from "./components/RecommendationGallery";

const getCurrentUserId = () => {
  try {
    const u = JSON.parse(localStorage.getItem("user"));
    return u?.user_id || null;
  } catch {
    return null;
  }
};

const ProfilePage = ({ userId, activeTab }) => {
  const resolvedUserId = userId || getCurrentUserId();
  const [profile, setProfile] = useState(null);
  const [currentRecommendation, setCurrentRecommendation] = useState(null);
  const [recommendations, setRecommendations] = useState(() => {
    const saved = localStorage.getItem(`recommendations_${resolvedUserId}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const BASE_API_URL = "http://localhost:8000";

  useEffect(() => {
    if (!resolvedUserId) return;

    fetch(`${BASE_API_URL}/profiles/${resolvedUserId}`)
      .then((res) => (res.status === 404 ? null : res.json()))
      .then((data) => {
        setProfile(data);
        setLoading(false);
        if (data?.recommendation_id) {
          fetch(`${BASE_API_URL}/recommendations/${data.recommendation_id}`)
            .then((res) => res.json())
            .then((rec) => setRecommendations(rec && rec.data ? [rec] : []));
        }
      })
      .catch(() => setLoading(false));
  }, [resolvedUserId]);

  useEffect(() => {
    const saved = localStorage.getItem(`recommendations_${resolvedUserId}`);
    if (saved) {
      setRecommendations(JSON.parse(saved));
    }
  }, [resolvedUserId]);

  const handleProfileCreated = (newProfile) => {
    setProfile(newProfile);
    setEditing(false);

    if (newProfile?.recommendation_id) {
      fetch(`${BASE_API_URL}/recommendations/${newProfile.recommendation_id}`)
        .then((res) => res.json())
        .then((rec) => setRecommendations(rec && rec.data ? [rec] : []));
    }
  };

  useEffect(() => {
    // Save recommendations to localStorage whenever they change
    if (recommendations.length > 0) {
      localStorage.setItem(
        `recommendations_${resolvedUserId}`,
        JSON.stringify(recommendations)
      );
    }
  }, [recommendations, resolvedUserId]);

  useEffect(() => {
    // Load recommendations from localStorage when userId changes
    const saved = localStorage.getItem(`recommendations_${resolvedUserId}`);
    if (saved) {
      setRecommendations(JSON.parse(saved));
    }
  }, [resolvedUserId]);

  useEffect(() => {
    if (typeof activeTab !== "undefined" && activeTab !== "profile") {
      setCurrentRecommendation(null);
    }
  }, [activeTab]);

  const handleGetRecommendation = async () => {
    const user = profile.data?.[0];
    const response = await fetch(`${BASE_API_URL}/ai/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.user_id,
        // add other required fields here if needed
      }),
    });
    if (response.ok) {
      const rec = await response.json();
      setCurrentRecommendation(rec); // Only set latest, do not save to history here
    }
  };

  const RecommendationHistoryCard = ({ rec, idx }) => (
    <div
      style={{
        background: "#f3f4f6",
        borderRadius: "8px",
        padding: "1em",
        marginBottom: "1em",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      <h4 style={{ color: "#db2777", marginBottom: "0.5em" }}>
        {rec.data?.[0]?.perfume || "Perfume Recommendation"}
      </h4>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {rec.data &&
          Object.entries(rec.data[0])
            .filter(([key]) => !["image_url"].includes(key))
            .map(([key, value]) =>
              typeof value === "string" ||
              typeof value === "number" ||
              Array.isArray(value) ? (
                <li key={key} style={{ marginBottom: "0.3em" }}>
                  <span style={{ fontWeight: "bold", color: "#d946ef" }}>
                    {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}:
                  </span>{" "}
                  <span style={{ color: "#333" }}>
                    {Array.isArray(value)
                      ? value.length > 0
                        ? value.join(", ").replace(/["[\]]/g, "")
                        : "None"
                      : value !== null && value !== undefined && value !== ""
                      ? value
                      : "Not specified"}
                  </span>
                </li>
              ) : null
            )}
      </ul>
      <div style={{ fontSize: "0.9em", color: "#888", marginTop: "0.5em" }}>
        {idx === 0 ? "Latest" : `Previous #${idx + 1}`}
      </div>
    </div>
  );

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

  // Helper to display all profile fields except message, user_id, id
  const ProfileDetails = (profileObj) => (
    <div
      style={{
        background: "#fafafa",
        borderRadius: "8px",
        padding: "1em",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        marginBottom: "2em",
      }}
    >
      <h2
        style={{
          marginBottom: "1em",
          color: "#7c3aed",
        }}
      >
        Your Profile Details
      </h2>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {Object.entries(profileObj)
          .filter(([key]) => !["message", "user_id", "id"].includes(key))
          .map(([key, value]) =>
            typeof value === "string" ||
            typeof value === "number" ||
            Array.isArray(value) ? (
              <li key={key} style={{ marginBottom: "0.5em" }}>
                <span
                  style={{
                    fontWeight: "bold",
                    color: "#6d28d9",
                  }}
                >
                  {key
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                  :
                </span>{" "}
                <span style={{ color: "#333" }}>
                  {Array.isArray(value)
                    ? value.length > 0
                      ? value.join(", ").replace(/["[\]]/g, "")
                      : "None"
                    : value !== null && value !== undefined && value !== ""
                    ? value
                    : "Not specified"}
                </span>
              </li>
            ) : null
          )}
      </ul>
    </div>
  );

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "2em auto",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 4px 24px rgba(124,58,237,0.07)",
        padding: "2em",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2em",
        }}
      >
        <h1
          style={{
            fontSize: "2em",
            color: "#7c3aed",
            fontWeight: "bold",
          }}
        >
          Profile
        </h1>
        <div>
          <button
            onClick={() => setEditing(true)}
            style={{
              marginRight: "1em",
              padding: "0.5em 1em",
              background: "#eee",
              borderRadius: "6px",
              border: "none",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Update Profile
          </button>
          <button
            onClick={handleGetRecommendation}
            style={{
              padding: "0.5em 1em",
              background: "linear-gradient(90deg,#f472b6,#a78bfa)",
              color: "#fff",
              borderRadius: "6px",
              border: "none",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Get Recommendation
          </button>
        </div>
      </div>
      {ProfileDetails(profile.data?.[0] || {})}
      <h3
        style={{
          color: "#db2777",
          marginBottom: "1em",
        }}
      >
        Your Recommendations
      </h3>
      {currentRecommendation ? (
        <div style={{ marginTop: "2em" }}>
          <RecommendationGallery recommendation={currentRecommendation} />
          <div style={{ fontSize: "0.9em", color: "#888", marginTop: "0.5em" }}>
            Latest
          </div>
        </div>
      ) : (
        <div
          style={{
            marginTop: "2em",
            background: "#f3f4f6",
            padding: "1em",
            borderRadius: "8px",
            color: "#6b7280",
            textAlign: "center",
          }}
        >
          No recommendation yet.
        </div>
      )}

      {currentRecommendation && (
        <button
          onClick={() => setRecommendations(prev => [currentRecommendation, ...prev])}
          style={{
            marginTop: "1em",
            padding: "0.5em 1em",
            background: "#a78bfa",
            color: "#fff",
            borderRadius: "6px",
            border: "none",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Save to History
        </button>
      )}

      <h3 style={{ color: "#db2777", marginBottom: "1em" }}>
        Your Recommendation History
      </h3>
      {recommendations.length > 0 ? (
        <div style={{ marginTop: "1em", display: "grid", gap: "1em" }}>
          {recommendations.map((rec, idx) => (
            <div
              key={idx}
              style={{
                background: "#fafafa",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                padding: "1em",
              }}
            >
              <RecommendationGallery recommendation={rec} />
              <div style={{ fontSize: "0.9em", color: "#888", marginTop: "0.5em" }}>
                {idx === 0 ? "Latest Saved" : `Previous #${idx + 1}`}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            marginTop: "1em",
            background: "#f3f4f6",
            padding: "1em",
            borderRadius: "8px",
            color: "#6b7280",
            textAlign: "center",
          }}
        >
          No recommendation history yet.
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
