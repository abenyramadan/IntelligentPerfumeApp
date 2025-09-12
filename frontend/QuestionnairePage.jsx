import { useEffect, useState } from "react";
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

import { convertToArray, groupDataByKey } from "./utils/utils.js";
import { ArrowLeft, ArrowRight } from "lucide-react";

const getCurrentUserId = () => {
  try {
    const u = JSON.parse(localStorage.getItem("user"));
    return u?.id || 1;
  } catch {
    return 1;
  }
};

const QuestionnairePage = ({ userId: propUserId }) => {
  const resolvedUserId = propUserId || getCurrentUserId();

  const [answers, setAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [topicId, setTopicId] = useState(0);

  useEffect(() => {
    const load = async () => {
      const res = await ApiService.listQuestionnaireQuestions();

      console.log("Response from backend", res);

      if (res?.success) {
        // toast.success("Found questions");

        const groupedData = groupDataByKey(res.data, "question_topic");
        console.log("Grouped data", JSON.parse(groupedData));

        // convert comma seperated mutiple choices to array

        setQuestions(JSON.parse(groupedData));
      } else {
        toast.error(res?.message || "Something went wrong");
      }
    };
    load();
  }, []);

  const handleChange = (id, value) => {
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
      return { ...prev, [id]: next };
    });
  };

  const handleNext = () => {
    if (topicId < questions.length - 1) {
      setTopicId((prev_val) => prev_val + 1);
      console.log("TopicId, Questions length  ", topicId, questions.length);
    }
  };
  const handlePrevious = () => {
    if (topicId > 0) {
      setTopicId((pre) => pre - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    // Ensure user exists before submitting responses
    let userId = resolvedUserId;

    // Submit questionnaire responses using the correct userId
    for (const q of questions) {
      const value = answers[q.id];
      if (value === undefined || value === "") continue;
      const payload =
        q.type === "number"
          ? { question_id: q.id, answer_number: Number(value) }
          : { question_id: q.id, answer_text: value };
      await ApiService.submitQuestionnaireResponse(userId, payload);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {questions.map((question, idx) => (
        <>
          {topicId == idx && (
            <Card key={idx}>
              <CardHeader>
                <CardTitle>{question?.topic}</CardTitle>
              </CardHeader>
              <CardContent key={idx}>
                {question.questions.map((q) => (
                  <>
                    <div key={q.id} className="mb-3">
                      <Label
                        htmlFor={q.id}
                        className="font-semibold md:text-xl"
                      >
                        {q.question_id + ". " + q.question_text}
                      </Label>

                      {/* if you can select more than one choice */}

                      {q.type === "select" && q.can_select_multiple && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                          {convertToArray(q.multiple_choices).map((opt) => (
                            <div
                              key={opt}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`${q.id}-${opt}`}
                                checked={(answers[q.id] || []).includes(opt)}
                                onCheckedChange={() =>
                                  toggleMultiSelect(q.id, opt, q.max)
                                }
                              />
                              <Label
                                htmlFor={`${q.id}-${opt}`}
                                className="text-sm"
                              >
                                {opt}
                              </Label>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* FOR SINGLE VALUE */}
                      {q.type === "select" && !q.can_select_multiple && (
                        <>
                          {convertToArray(q.multiple_choices).map((opt) => (
                            <div
                              key={opt}
                              className="flex items-center ml-2 space-x-2"
                            >
                              <Checkbox
                                id={`${q.id}-${opt}`}
                                checked={(answers[q.id] || []).includes(opt)}
                                onCheckedChange={() =>
                                  toggleMultiSelect(q.id, opt, q.max)
                                }
                              />
                              <Label
                                htmlFor={`${q.id}-${opt}`}
                                className="text-sm"
                              >
                                {opt}
                              </Label>
                            </div>
                          ))}
                        </>
                      )}

                      {/* FOR NUMBER */}
                      {/* {q.type === "number" && (
                      <Input
                        type="number"
                        min={q.min}
                        max={q.max}
                        step={q.step || 1}
                        onChange={(e) => handleChange(q.id, e.target.value)}
                      />
                    )} */}

                      {/* FOR TEXT INPUT */}
                      {(!q.type || q.type === "text") && (
                        <Input
                          onChange={(e) => handleChange(q.id, e.target.value)}
                        />
                      )}
                    </div>
                  </>
                ))}

                <div className="flex justify-end gap-3">
                  {topicId > 0 && (
                    <Button onClick={handlePrevious}>
                      <ArrowLeft />
                      Previous
                    </Button>
                  )}

                  {topicId === questions.length - 1 ? (
                    <Button>Submit</Button>
                  ) : (
                    <Button onClick={handleNext}>
                      Next
                      <ArrowRight />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ))}
    </div>
  );
};

export default QuestionnairePage;
