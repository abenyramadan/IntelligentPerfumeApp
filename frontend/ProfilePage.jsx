import React, { useEffect, useState } from "react";
import QuestionnairePage from "./QuestionnairePage";
import MyProfilePage from "./MyProfilePage";

const getCurrentUserId = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    // Try different possible user ID fields (id first, then user_id)
    return user?.id || user?.user_id || null;
  } catch {
    return null; // Return null instead of 1 to avoid showing wrong user's data
  }
};

const ProfilePage = ({ userId, activeTab }) => {
  const resolvedUserId = userId || getCurrentUserId();

  // Remove the getUserIdFromProfile function - always use logged-in user
  // const getUserIdFromProfile = (profileData) => {
  //   if (profileData?.user_id) {
  //     return profileData.user_id;
  //   }
  //   if (profileData?.id) {
  //     return profileData.id;
  //   }
  //   return resolvedUserId; // Use the actual logged-in user ID
  // };

  // Always use the logged-in user's ID, not the profile's user_id
  const finalUserId = resolvedUserId;

  const [profile, setProfile] = useState(null);
  const [currentRecommendation, setCurrentRecommendation] = useState(null);
  const [recommendations, setRecommendations] = useState(() => {
    const saved = localStorage.getItem(`recommendations_${resolvedUserId}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const BASE_API_URL = "http://localhost:8000";

  // Handle different profile data structures
  const getProfileData = () => {
    if (!profile) return null;

    // If profile is the API response wrapper {success, message, data: [...]}
    if (profile.data && Array.isArray(profile.data) && profile.data.length > 0) {
      return profile.data[0]; // Return the actual profile object
    }

    // If profile is already the direct profile object
    if (typeof profile === 'object' && profile.id) {
      return profile;
    }

    return null;
  };

  useEffect(() => {
    if (!resolvedUserId) {
      setLoading(false);
      return;
    }

    // Use resolvedUserId (actual logged-in user) to fetch profile
    fetch(`${BASE_API_URL}/profiles/user/${resolvedUserId}`)
      .then((res) => res.json())
      .then((data) => {
        // Check if the response contains actual profile data
        if (data && data.data && data.data.length > 0) {
          setProfile(data);
        } else {
          // No profile found for this user
          setProfile(null);
        }
        setLoading(false);
        if (data?.data?.[0]?.recommendation_id) {
          fetch(`${BASE_API_URL}/recommendations/${data.data[0].recommendation_id}`)
            .then((res) => res.json())
            .then((rec) => setRecommendations(rec?.data ? [rec] : []));
        }
      })
      .catch(() => {
        setProfile(null);
        setLoading(false);
      });
  }, [resolvedUserId]);

  const handleProfileCreated = (newProfile) => {
    setProfile(newProfile);
    setEditing(false);

    // Also refresh the profile data from the backend to ensure we have the latest
    if (resolvedUserId) {
      fetch(`${BASE_API_URL}/profiles/user/${resolvedUserId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.data && data.data.length > 0) {
            setProfile(data);
          }
        })
        .catch((err) => console.error('Error refreshing profile:', err));
    }

    if (newProfile?.data?.[0]?.recommendation_id) {
      fetch(`${BASE_API_URL}/recommendations/${newProfile.data[0].recommendation_id}`)
        .then((res) => res.json())
        .then((rec) => setRecommendations(rec?.data ? [rec] : []));
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // No profile yet or editing → show questionnaire
  if (editing || !profile || !profile.data || profile.data.length === 0) {
    return (
      <QuestionnairePage
        userId={resolvedUserId}
        onProfileCreated={handleProfileCreated}
      />
    );
  }

  // Profile exists → show dedicated MyProfilePage
  const profileData = getProfileData();

  return <MyProfilePage profile={profile} userId={finalUserId} />;
};

export default ProfilePage;
