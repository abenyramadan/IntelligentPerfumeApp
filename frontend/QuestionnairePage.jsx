import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { useQuestionnaire } from "./services/useApi";
import ApiService from "./services/api.js";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import { convertToArray, groupDataByKey } from "./utils/utils.js";
import { ArrowLeft, ArrowRight } from "lucide-react";

const getCurrentUserId = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    // Try different possible user ID fields (id first, then user_id)
    return user?.id || user?.user_id || null;
  } catch {
    return null; // Return null instead of 1 to avoid showing wrong user's data
  }
};

const QuestionnairePage = ({ userId: propUserId, onProfileCreated }) => {
  const navigate = useNavigate();
  const resolvedUserId = propUserId || getCurrentUserId();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [topicId, setTopicId] = useState(0);
  const [loading, setLoading] = useState(true);
  const [profileCreated, setProfileCreated] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [recommendation, setRecommendation] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await ApiService.listQuestionnaireQuestions();
        console.log("Response from backend", res);

        if (res?.success) {
          // Check if groupedData is already an object or needs parsing
          let groupedData;
          try {
            // Try to parse if it's a string, otherwise use directly
            groupedData = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
          } catch (e) {
            console.error("Error parsing data:", e);
            groupedData = res.data;
          }
          
          console.log("Grouped data", groupedData);
          
          // Ensure the data has the expected structure
          if (Array.isArray(groupedData)) {
            // Group questions by topic
            const groupedByTopic = groupedData.reduce((acc, q) => {
              const topic = q.question_topic || "General";
              if (!acc[topic]) acc[topic] = [];
              acc[topic].push(q);
              return acc;
            }, {});
            // Convert to array of { topic, questions }
            const topicsArray = Object.entries(groupedByTopic).map(([topic, questions]) => ({
              topic,
              questions,
            }));
            setQuestions(topicsArray);
          } else {
            console.error("Expected array but got:", typeof groupedData, groupedData);
            toast.error("Invalid data format received");
          }
        } else {
          toast.error(res?.message || "Something went wrong");
        }
      } catch (err) {
        console.error("Error loading questions:", err);
        toast.error("Failed to load questions");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (id, value) => {
    console.log('=== DEBUG: Form input changed ===');
    console.log('Question ID:', id);
    console.log('New value:', value);
    console.log('Value type:', typeof value);
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const toggleMultiSelect = (id, option, max) => {
    setAnswers((prev) => {
      const current = Array.isArray(prev[id]) ? prev[id] : [];
      const exists = current.includes(option);
      const next = exists
        ? current.filter((o) => o !== option)
        : [...current, option];
      if (max && next.length > max) return prev;

      console.log('=== DEBUG: Multi-select changed ===');
      console.log('Question ID:', id);
      console.log('Option:', option);
      console.log('Previous selection:', current);
      console.log('New selection:', next);

      return { ...prev, [id]: next };
    });
  };

  const handleNext = () => {
    if (topicId < questions.length - 1) {
      console.log('=== DEBUG: Moving to next topic ===');
      console.log('Current answers at topic', topicId, ':', answers);
      setTopicId((prev_val) => prev_val + 1);
    }
  };

  const handlePrevious = () => {
    if (topicId > 0) {
      setTopicId((pre) => pre - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const userId = Number(getCurrentUserId());

      console.log('=== DEBUG: Submitting questionnaire ===');
      console.log('User ID:', userId);
      console.log('Resolved User ID:', resolvedUserId);
      console.log('Answers object:', answers);
      console.log('Number of answers:', Object.keys(answers).length);
      console.log('Questions loaded:', questions?.length || 0);

      // Validate that we have questions loaded
      if (!questions || questions.length === 0) {
        toast.error("Questions not loaded properly. Please refresh and try again.");
        setSubmitting(false);
        return;
      }

      // Ensure user ID is consistent
      if (userId !== resolvedUserId) {
        console.warn(`User ID mismatch: ${userId} vs ${resolvedUserId}, using ${resolvedUserId}`);
      }

      // Save each questionnaire response
      for (const [question_id, value] of Object.entries(answers)) {
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
          user_id: resolvedUserId, // Use resolved user ID for consistency
          question_id: String(question_id),
          answer_text,
          answer_number,
          answer_json,
        };

        console.log('Saving response for question', question_id, ':', responseObj);

        const response = await fetch('http://127.0.0.1:8000/questionnaires/responses/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(responseObj),
        });

        if (!response.ok) {
          toast.error(`Failed to save response for question ${question_id}`);
          setSubmitting(false);
          return;
        }
      }

      // Create payload for AI profile creation
      const profilePayload = {
        user_id: resolvedUserId,
        questions: questions.flatMap(topic =>
          topic.questions ? topic.questions.map(q => ({
            question_id: q.question_id,
            question_text: q.question_text,
            question_topic: q.question_topic
          })) : []
        ),
        answers: Object.entries(answers).map(([questionId, answerValue]) => {
          const question = questions.flatMap(topic =>
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

      console.log('Profile creation payload:', profilePayload);

      const profileRes = await fetch("http://127.0.0.1:8000/profiles/create/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profilePayload),
      });

      console.log('Profile creation response status:', profileRes.status);

      if (profileRes.ok) {
        const createdProfile = await profileRes.json();
        console.log('Profile created successfully:', createdProfile);

        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        const updatedUser = {
          ...storedUser,
          profile: createdProfile,
          profile_id: createdProfile.id
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // Call the callback with the created profile data
        if (onProfileCreated) {
          onProfileCreated(createdProfile);
        }

        toast.success("Profile created! Redirecting…");
        // Navigate back to profile page instead of /myprofile
        navigate("/profile");
      } else {
        const err = await profileRes.json().catch(() => null);
        console.error('Profile creation failed:', err);
        toast.error(err?.detail?.[0]?.msg || "Failed to create user profile");
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGetRecommendation = async () => {
    const userId = Number(getCurrentUserId());
    const recResponse = await fetch('http://127.0.0.1:8000/ai/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId }),
    });
    if (recResponse.ok) {
      const recs = await recResponse.json();
      setRecommendation(recs);
      toast.success('Recommendation loaded!');
    } else {
      toast.error('Failed to get recommendations');
    }
  };

  if (loading) {
    return <div className="max-w-3xl mx-auto p-8">Loading questions...</div>;
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-8">
        <div className="text-center text-gray-500">
          No questions available or failed to load questions.
        </div>
      </div>
    );
  }

  // Fallback: If questions is a flat array (no .questions property)
  if (
    Array.isArray(questions) &&
    questions.length > 0 &&
    !questions[0].questions
  ) {
    return (
      <div className="max-w-3xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Questions</CardTitle>
          </CardHeader>
          <CardContent>
            {questions.map((q) => (
              <div key={`question-${q.id}`} className="mb-6">
                <Label htmlFor={q.id} className="font-semibold md:text-xl block mb-3">
                  {q.question_id ? `${q.question_id}. ` : ""}
                  {q.question_text || "Question"}
                </Label>

                {/* Multiple choice selection */}
                {["select", "radio"].includes(q.type) && q.can_select_multiple && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {q.multiple_choices &&
                      convertToArray(q.multiple_choices).map((opt) => (
                        <div key={`option-${q.id}-${opt}`} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${q.id}-${opt}`}
                            checked={(answers[q.id] || []).includes(opt)}
                            onCheckedChange={() => toggleMultiSelect(q.id, opt, q.max)}
                          />
                          <Label htmlFor={`${q.id}-${opt}`} className="text-sm cursor-pointer">
                            {opt}
                          </Label>
                        </div>
                      ))}
                  </div>
                )}

                {/* Single choice selection */}
                {["select", "radio"].includes(q.type) && !q.can_select_multiple && (
                  <div className="space-y-2 mt-2">
                    {q.multiple_choices &&
                      convertToArray(q.multiple_choices).map((opt) => (
                        <div key={`single-${q.id}-${opt}`} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id={`${q.id}-${opt}`}
                            name={q.id}
                            value={opt}
                            checked={answers[q.id] === opt}
                            onChange={(e) => handleChange(q.id, opt)}
                            className="mr-2"
                          />
                          <Label htmlFor={`${q.id}-${opt}`} className="text-sm cursor-pointer">
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
                    value={answers[q.id] || ""}
                    onChange={(e) => handleChange(q.id, e.target.value)}
                    className="mt-2"
                  />
                )}

                {/* Text input */}
                {(!q.type || q.type === "text") && (
                  <Input
                    value={answers[q.id] || ""}
                    onChange={(e) => handleChange(q.id, e.target.value)}
                    className="mt-2"
                  />
                )}
              </div>
            ))}
            <div className="flex justify-end gap-3 mt-6">
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

 

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {questions.map((question, idx) => (
        <React.Fragment key={`topic-${idx}`}>
          {topicId === idx && (
            <Card key={`card-${idx}`}>
              <CardHeader>
                <CardTitle>{question?.topic || `Topic ${idx + 1}`}</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Add safety check for question.questions */}
                {question.questions && Array.isArray(question.questions) ? (
                  question.questions.map((q) => (
                    <div key={`question-${q.id}`} className="mb-6">
                      <Label htmlFor={q.id} className="font-semibold md:text-xl block mb-3">
                        {q.question_id ? `${q.question_id}. ` : ""}{q.question_text || "Question"}
                      </Label>

                      {/* Multiple choice selection (checkboxes) */}
                      {q.type === "select" && q.can_select_multiple && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                          {q.multiple_choices && convertToArray(q.multiple_choices).map((opt) => (
                            <div key={`option-${q.id}-${opt}`} className="flex items-center space-x-2">
                              <Checkbox
                                id={`${q.id}-${opt}`}
                                checked={(answers[q.id] || []).includes(opt)}
                                onCheckedChange={() => toggleMultiSelect(q.id, opt, q.max)}
                              />
                              <Label htmlFor={`${q.id}-${opt}`} className="text-sm cursor-pointer">
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
                            <div key={`single-${q.id}-${opt}`} className="flex items-center space-x-2">
                              <input
                                type="radio"
                                id={`${q.id}-${opt}`}
                                name={q.id}
                                value={opt}
                                checked={answers[q.id] === opt}
                                onChange={(e) => handleChange(q.id, e.target.value)}
                                className="mr-2"
                              />
                              <Label htmlFor={`${q.id}-${opt}`} className="text-sm cursor-pointer">
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
                          value={answers[q.id] || ""}
                          onChange={(e) => handleChange(q.id, e.target.value)}
                          className="mt-2"
                        />
                      )}

                      {/* Text input */}
                      {(!q.type || q.type === "text") && (
                        <Input
                          value={answers[q.id] || ""}
                          onChange={(e) => handleChange(q.id, e.target.value)}
                          className="mt-2"
                        />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500">No questions available for this topic.</div>
                )}

                <div className="flex justify-end gap-3 mt-6">
                  {topicId > 0 && (
                    <Button onClick={handlePrevious} disabled={submitting}>
                      <ArrowLeft className="mr-2" />
                      Previous
                    </Button>
                  )}

                  {topicId === questions.length - 1 ? (
                    <Button onClick={handleSubmit} disabled={submitting}>
                      {submitting ? "Submitting..." : "Submit"}
                    </Button>
                  ) : (
                    <Button onClick={handleNext}>
                      Next
                      <ArrowRight className="ml-2" />
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
};

export default QuestionnairePage;