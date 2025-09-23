import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import RecommendationGallery from "./RecommendationGallery";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { convertToArray } from "./utils/utils.js";

// Force cache busting - update this timestamp to force reload
const CACHE_BUST = "v2.0.1";

const BASE_API = "http://127.0.0.1:8000";
const STORAGE_KEY = (userId) => `recommendation_history_user_${userId}`;

const MyProfilePage = ({ profile, userId }) => {
  const navigate = useNavigate();
  const [recommendation, setRecommendation] = useState(null);
  const [recommendationsHistory, setRecommendationsHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);
  // Fix: Use proper userId instead of defaulting to 1
  const resolvedUserId = userId;

  // NEW: Add missing editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editAnswers, setEditAnswers] = useState({});
  const [editQuestions, setEditQuestions] = useState([]);
  const [editLoading, setEditLoading] = useState(false);
  const [editTopicId, setEditTopicId] = useState(0);

  // Helper function to check if a recommendation is valid
  const isValidRecommendation = (rec) => {
    if (!rec) return false;
    const main = rec.data && rec.data[0] ? rec.data[0] : rec;
    return main && main.perfume && main.perfume.trim() !== '';
  };

  // Filter out invalid recommendations
  const validRecommendationsHistory = recommendationsHistory.filter(isValidRecommendation);
  const validHistory = history.filter(isValidRecommendation);

  // Early return if no valid userId
  if (!resolvedUserId) {
    console.error('MyProfilePage: No valid userId available');
    return (
      <div className="max-w-3xl mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p className="text-gray-600 mb-6">
          Unable to load profile. Please try refreshing the page.
        </p>
        <Button onClick={() => window.location.reload()}>
          Refresh Page
        </Button>
      </div>
    );
  }

  // Fetch latest recommendation and history on component mount
  useEffect(() => {
    console.log('MyProfilePage: resolvedUserId =', resolvedUserId);
    console.log('MyProfilePage: userId prop =', userId);

    const fetchRecommendations = async () => {
      try {
        // Try to fetch latest recommendation (skip if fails)
        try {
          const latestRes = await fetch(`${BASE_API}/recommendations/my/latest?user_id=${resolvedUserId}`);
          if (latestRes.ok) {
            const latestData = await latestRes.json();
            if (latestData.success && latestData.data && latestData.data.length > 0) {
              setRecommendation(latestData.data[0]);
            }
          }
        } catch (error) {
          // Silent fail for latest recommendation
        }

        // Try to fetch recommendation history (skip if fails)
        try {
          const historyRes = await fetch(`${BASE_API}/recommendations/my?user_id=${resolvedUserId}&limit=5`);
          if (historyRes.ok) {
            const historyData = await historyRes.json();
            if (historyData.success && historyData.data) {
              setRecommendationsHistory(historyData.data);

              // Save to localStorage for persistence
              const updatedHistory = [...historyData.data, ...history.filter(localRec =>
                !historyData.data.find(apiRec => apiRec.ai_perfume_name === localRec.ai_perfume_name)
              )].slice(0, 10);

              localStorage.setItem(STORAGE_KEY(resolvedUserId), JSON.stringify(updatedHistory));
              setHistory(updatedHistory);
            }
          }
        } catch (error) {
          // Silent fail for history fetch
        }
      } catch (error) {
        console.error('Error in fetchRecommendations:', error);
      }
    };

    if (resolvedUserId) {
      fetchRecommendations();
    }
  }, [resolvedUserId]);

  const handleGetRecommendation = async () => {
    try {
      const res = await fetch(`${BASE_API}/ai/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: resolvedUserId }),
      });
      const rec = await res.json();
      if (res.ok) {
        const newRecommendation = rec.data ? rec.data[0] : rec;
        setRecommendation(newRecommendation);
        toast.success("Recommendation loaded!");

        // Add to local storage history (avoid duplicates)
        setHistory(prev => {
          const exists = prev.find(r => r.ai_perfume_name === newRecommendation.ai_perfume_name);
          if (exists) return prev;

          const updated = [newRecommendation, ...prev].slice(0, 10); // Keep last 10
          localStorage.setItem(STORAGE_KEY(resolvedUserId), JSON.stringify(updated));
          return updated;
        });
      } else {
        toast.error(rec.error || rec.message || "Failed to get recommendation");
      }
    } catch (error) {
      console.error('Recommendation error:', error);
      toast.error("Network error");
    }
  };

  const handleUpdateProfile = async () => {
    if (isEditing) {
      // Cancel editing
      setIsEditing(false);
      setEditAnswers({});
      setEditQuestions([]);
    } else {
      // Start editing
      setIsEditing(true);
      await loadProfileForEditing();
    }
  };

  const loadProfileForEditing = async () => {
    setEditLoading(true);
    try {
      // Load questionnaire questions
      const questionsRes = await fetch('http://127.0.0.1:8000/questionnaires/questions');
      if (!questionsRes.ok) throw new Error('Failed to load questions');

      const questionsData = await questionsRes.json();
      let questions = [];

      if (questionsData.success) {
        try {
          questions = typeof questionsData.data === 'string'
            ? JSON.parse(questionsData.data)
            : questionsData.data;
        } catch (e) {
          console.error("Error parsing questions data:", e);
          questions = questionsData.data;
        }

        // Group questions by topic
        if (Array.isArray(questions)) {
          const groupedByTopic = questions.reduce((acc, q) => {
            const topic = q.question_topic || "General";
            if (!acc[topic]) acc[topic] = [];
            acc[topic].push(q);
            return acc;
          }, {});

          const topicsArray = Object.entries(groupedByTopic).map(([topic, questions]) => ({
            topic,
            questions,
          }));
          setEditQuestions(topicsArray);
        }
      }

      // Load existing profile data to pre-populate answers
      const profileRes = await fetch(`http://127.0.0.1:8000/profiles/user/${resolvedUserId}`);
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        if (profileData.success && profileData.data && profileData.data.length > 0) {
          const profile = profileData.data[0];

          // Convert profile data to answers format
          const prefilledAnswers = {};

          // Map profile fields to question answers
          Object.entries(profile).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
              // Handle arrays
              if (Array.isArray(value)) {
                if (value.length > 0) {
                  prefilledAnswers[key] = value;
                }
              } else if (typeof value === 'string' || typeof value === 'number') {
                prefilledAnswers[key] = value;
              }
            }
          });

          setEditAnswers(prefilledAnswers);
        }
      }
    } catch (error) {
      console.error('Error loading profile for editing:', error);
      toast.error('Failed to load profile data for editing');
    } finally {
      setEditLoading(false);
    }
  };

  const handleEditAnswerChange = (id, value) => {
    setEditAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleEditSubmit = async () => {
    setEditLoading(true);
    try {
      // First, save questionnaire responses
      for (const [question_id, value] of Object.entries(editAnswers)) {
        let answer_text = null;
        let answer_number = null;
        let answer_json = null;

        if (typeof value === "number") {
          answer_number = value;
        } else if (Array.isArray(value)) {
          answer_json = JSON.stringify(value);
        } else {
          answer_text = value;
        }

        const responseObj = {
          user_id: resolvedUserId,
          question_id: String(question_id),
          answer_text,
          answer_number,
          answer_json,
        };

        const response = await fetch('http://127.0.0.1:8000/questionnaires/responses/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(responseObj),
        });

        if (!response.ok) {
          toast.error(`Failed to save response for question ${question_id}`);
          setEditLoading(false);
          return;
        }
      }

      // Then update/create profile
      const profilePayload = {
        user_id: resolvedUserId,
        questions: editQuestions.flatMap(topic =>
          topic.questions ? topic.questions.map(q => ({
            question_id: q.question_id,
            question_text: q.question_text,
            question_topic: q.question_topic
          })) : []
        ),
        answers: Object.entries(editAnswers).map(([questionId, answerValue]) => {
          const question = editQuestions.flatMap(topic =>
            topic.questions || []
          ).find(q => q.id === questionId || q.question_id === questionId);

          let processedAnswer = answerValue;
          if (Array.isArray(answerValue)) {
            processedAnswer = answerValue.join(", ");
          }

          return {
            question_id: questionId,
            answer: processedAnswer,
            question_text: question?.question_text || `Question ${questionId}`
          };
        })
      };

      const profileRes = await fetch("http://127.0.0.1:8000/profiles/create/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profilePayload),
      });

      if (profileRes.ok) {
        const updatedProfile = await profileRes.json();
        toast.success("Profile updated successfully!");

        // Refresh the page data
        window.location.reload();
      } else {
        const err = await profileRes.json().catch(() => null);
        toast.error(err?.detail?.[0]?.msg || "Failed to update profile");
      }
    } catch (error) {
      console.error('Edit submit error:', error);
      toast.error("An error occurred while updating profile");
    } finally {
      setEditLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditAnswers({});
    setEditQuestions([]);
  };

  const handleEditNext = () => {
    if (editTopicId < editQuestions.length - 1) {
      setEditTopicId((prev_val) => prev_val + 1);
    }
  };

  const handleEditPrevious = () => {
    if (editTopicId > 0) {
      setEditTopicId((pre) => pre - 1);
    }
  };

  // Handle different profile data structures
  const getProfileData = () => {
    if (!profile) return null;

    // If profile has data wrapper with array
    if (profile.data && Array.isArray(profile.data) && profile.data.length > 0) {
      return profile.data[0];
    }

    // If profile is the direct data object
    if (typeof profile === 'object' && profile.id) {
      return profile;
    }

    // If profile is wrapped in data object
    if (profile.data && typeof profile.data === 'object') {
      return profile.data;
    }

    return profile;
  };

  const profileData = getProfileData();

  // load from localStorage once
  useEffect(() => {
    if (!resolvedUserId) return;
    const saved = localStorage.getItem(STORAGE_KEY(resolvedUserId));
    if (saved) {
      try {
        const parsedHistory = JSON.parse(saved);
        setHistory(parsedHistory);

        // Show history by default if there are valid recommendations
        if (parsedHistory.length > 0) {
          setShowHistory(true);
        }
      } catch (error) {
        console.error('Error parsing localStorage history:', error);
      }
    }
  }, [resolvedUserId]);

  if (!profileData) {
    return (
      <div className="max-w-3xl mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Profile Not Found</h2>
        <p className="text-gray-600 mb-6">
          It looks like you haven't created a profile yet. Let's create one!
        </p>
        <Button onClick={handleUpdateProfile}>
          Create Your Profile
        </Button>
      </div>
    );
  }

  // Show editing interface if in edit mode
  if (isEditing) {
    if (editLoading) {
      return <div className="max-w-3xl mx-auto p-8">Loading profile for editing...</div>;
    }

    if (!Array.isArray(editQuestions) || editQuestions.length === 0) {
      return (
        <div className="max-w-3xl mx-auto p-8">
          <div className="text-center text-gray-500">
            No questions available for editing or failed to load questions.
          </div>
          <div className="flex justify-center mt-4">
            <Button onClick={handleCancelEdit} variant="outline">
              Cancel Editing
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Edit Your Profile</h1>
          <Button onClick={handleCancelEdit} variant="outline">
            Cancel
          </Button>
        </div>

        {editQuestions.map((question, idx) => (
          <React.Fragment key={`edit-topic-${idx}`}>
            {editTopicId === idx && (
              <Card key={`edit-card-${idx}`}>
                <CardHeader>
                  <CardTitle>{question?.topic || `Topic ${idx + 1}`}</CardTitle>
                </CardHeader>
                <CardContent>
                  {question.questions && Array.isArray(question.questions) ? (
                    question.questions.map((q) => (
                      <div key={`edit-question-${q.id}`} className="mb-6">
                        <Label htmlFor={`edit-${q.id}`} className="font-semibold md:text-xl block mb-3">
                          {q.question_id ? `${q.question_id}. ` : ""}{q.question_text || "Question"}
                        </Label>

                        {/* Multiple choice selection (checkboxes) */}
                        {q.type === "select" && q.can_select_multiple && (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                            {q.multiple_choices && convertToArray(q.multiple_choices).map((opt) => (
                              <div key={`edit-option-${q.id}-${opt}`} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`edit-${q.id}-${opt}`}
                                  checked={(editAnswers[q.id] || []).includes(opt)}
                                  onCheckedChange={() => {
                                    const current = Array.isArray(editAnswers[q.id]) ? editAnswers[q.id] : [];
                                    const next = current.includes(opt)
                                      ? current.filter((o) => o !== opt)
                                      : [...current, opt];
                                    handleEditAnswerChange(q.id, next);
                                  }}
                                />
                                <Label htmlFor={`edit-${q.id}-${opt}`} className="text-sm cursor-pointer">
                                  {opt}
                                </Label>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Single choice selection (radio buttons) */}
                        {q.type === "select" && !q.can_select_multiple && (
                          <div className="space-y-2 mt-2">
                            {q.multiple_choices && convertToArray(q.multiple_choices).map((opt) => (
                              <div key={`edit-single-${q.id}-${opt}`} className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  id={`edit-${q.id}-${opt}`}
                                  name={`edit-${q.id}`}
                                  value={opt}
                                  checked={editAnswers[q.id] === opt}
                                  onChange={(e) => handleEditAnswerChange(q.id, e.target.value)}
                                  className="mr-2"
                                />
                                <Label htmlFor={`edit-${q.id}-${opt}`} className="text-sm cursor-pointer">
                                  {opt}
                                </Label>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Number input */}
                        {q.type === "number" && (
                          <Input
                            type="number"
                            min={q.min}
                            max={q.max}
                            step={q.step || 1}
                            value={editAnswers[q.id] || ""}
                            onChange={(e) => handleEditAnswerChange(q.id, e.target.value)}
                            className="mt-2"
                          />
                        )}

                        {/* Text input */}
                        {(!q.type || q.type === "text") && (
                          <Input
                            value={editAnswers[q.id] || ""}
                            onChange={(e) => handleEditAnswerChange(q.id, e.target.value)}
                            className="mt-2"
                          />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500">No questions available for this topic.</div>
                  )}

                  <div className="flex justify-between gap-3 mt-6">
                    {editTopicId > 0 && (
                      <Button onClick={handleEditPrevious} disabled={editLoading}>
                        <ArrowLeft className="mr-2" />
                        Previous
                      </Button>
                    )}

                    {editTopicId < editQuestions.length - 1 ? (
                      <Button onClick={handleEditNext}>
                        Next
                        <ArrowRight className="ml-2" />
                      </Button>
                    ) : (
                      <Button onClick={handleEditSubmit} disabled={editLoading}>
                        {editLoading ? "Updating..." : "Update Profile"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Profile Details & Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {Object.entries(profileData).map(([key, val]) => {
              // Skip only null, undefined, or empty strings
              if (val === null || val === undefined || val === '') {
                return null;
              }

              let displayValue = val;

              // Handle arrays
              if (Array.isArray(val)) {
                displayValue = val.length > 0 ? val.join(", ") : "None";
              }

              // Handle boolean values
              if (typeof val === 'boolean') {
                displayValue = val ? 'Yes' : 'No';
              }

              // For numeric values, show them even if they're 0
              if (typeof val === 'number') {
                displayValue = val;
              }

              return (
                <li key={key} className="mb-2">
                  <b className="capitalize">{key.replace(/_/g, " ")}:</b>{" "}
                  <span className="text-gray-700">{displayValue}</span>
                </li>
              );
            })}
          </ul>
          <div className="flex gap-4 mt-6">
            <Button onClick={handleGetRecommendation}>
              Get New Recommendation
            </Button>
            <Button variant="outline" onClick={handleUpdateProfile}>
              {isEditing ? 'Cancel Edit' : 'Update Your Profile'}
            </Button>
            {(validRecommendationsHistory.length > 1 || validHistory.length > 1) && (
              <Button
                variant="outline"
                onClick={() => setShowHistory(!showHistory)}
              >
                {showHistory ? 'Hide History' : 'View History'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Display Recommendation */}
      {recommendation && (
        <Card>
          <CardHeader>
            <CardTitle>Your Recommendation</CardTitle>
          </CardHeader>
          <CardContent>
            <RecommendationGallery recommendation={recommendation} />
          </CardContent>
        </Card>
      )}

      {/* Display Recommendation History */}
      {(showHistory || validRecommendationsHistory.length > 0 || validHistory.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Your Recommendation History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Display API recommendations first */}
              {validRecommendationsHistory.map((rec) => (
                <RecommendationGallery key={`api-${rec.id || rec.ai_perfume_name}`} recommendation={rec} />
              ))}

              {/* Display local storage recommendations (avoid duplicates) */}
              {validHistory.filter(localRec =>
                !validRecommendationsHistory.find(apiRec =>
                  apiRec.ai_perfume_name === localRec.ai_perfume_name
                )
              ).map((rec) => (
                <RecommendationGallery key={`local-${rec.id || rec.ai_perfume_name}`} recommendation={rec} />
              ))}

              {validRecommendationsHistory.length === 0 && validHistory.length === 0 && (
                <p className="text-gray-500 text-center">No recommendation history available yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MyProfilePage;