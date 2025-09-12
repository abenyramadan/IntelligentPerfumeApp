import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { useQuestionnaire } from "./services/useApi";
import ApiService from './services/api.js'


const getCurrentUserId = () => {
  try {
    const u = JSON.parse(localStorage.getItem('user'))
    return u?.id || 1
  } catch { return 1 }
}

const QuestionnairePage = ({ userId: propUserId, onProfileCreated }) => {
  const resolvedUserId = propUserId || getCurrentUserId()
  const { responses, loading, submitResponse } = useQuestionnaire(resolvedUserId)
  const [answers, setAnswers] = useState({})
  const [questions, setQuestions] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const load = async () => {
      const qs = await ApiService.listQuestionnaireQuestions()
      setQuestions(qs)
    }
    load()
  }, [])

  const handleChange = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }))
  }

  const toggleMultiSelect = (id, option, max) => {
    setAnswers(prev => {
      const current = Array.isArray(prev[id]) ? prev[id] : []
      const exists = current.includes(option)
      const next = exists ? current.filter(o => o !== option) : [...current, option]
      if (max && next.length > max) return prev
      return { ...prev, [id]: next }
    })
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setError("")
    // Ensure user exists before submitting responses
    let userId = resolvedUserId;
    try {
      // Try to get user
      const userRes = await fetch(`http://localhost:5000/api/users/${userId}`);
      if (!userRes.ok) {
        // Create user if not found
        const createRes = await fetch('http://localhost:5000/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: `testuser${userId}`, email: `testuser${userId}@example.com`, password: 'testpass123' })
        });
        if (createRes.ok) {
          const newUser = await createRes.json();
          userId = newUser.id;
        } else {
          alert('Failed to create user automatically.');
          return;
        }
      }
    } catch (err) {
      alert('Error checking/creating user: ' + err);
      return;
    }
    // Submit questionnaire responses using the correct userId
    try {
      for (const q of questions) {
        const value = answers[q.id];
        if (value === undefined || value === '') continue;
        const payload = q.type === 'number'
          ? { question_id: q.id, answer_number: Number(value) }
          : { question_id: q.id, answer_text: value };
        await ApiService.submitQuestionnaireResponse(userId, payload);
      }
      // Fetch recommendation after submitting responses
      try {
        const recRes = await fetch(`http://localhost:5000/api/users/${userId}/daily-recommendation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        if (recRes.ok) {
          const rec = await recRes.json();
          alert(`Recommended perfume: ${rec.perfume?.brand || ''} - ${rec.perfume?.name || ''}`);
        } else {
          alert('Failed to fetch recommendation.');
        }
      } catch (err) {
        alert('Error fetching recommendation: ' + err);
      }
    } catch (err) {
      setError("Could not submit responses. Please try again.");
    }
    setSubmitting(false)
  }

  if (loading) return <div>Loading questions...</div>;

  const renderInput = q => {
    const name = q.key || q.name;
    const value = answers[name] || "";

    if (q.type === "select" && Array.isArray(q.options)) {
      return (
        <Select
          value={value}
          onValueChange={(v) => handleChange(name, v)}
        >
          <SelectContent>
            {q.options.map(opt => (
              <SelectItem key={opt.value || opt} value={opt.value || opt}>{opt.label || opt}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (q.type === "radio" && Array.isArray(q.options)) {
      return (
        <div>
          {q.options.map(opt => (
            <label key={opt.value || opt} style={{ marginRight: "1em" }}>
              <input
                type="radio"
                name={name}
                value={opt.value || opt}
                checked={value === (opt.value || opt)}
                onChange={() => handleChange(name, opt.value || opt)}
                required={q.required !== false}
              />
              {opt.label || opt}
            </label>
          ))}
        </div>
      );
    }

    if (q.type === "textarea") {
      return (
        <textarea
          name={name}
          required={q.required !== false}
          value={value}
          onChange={e => handleChange(e, q)}
        />
      );
    }

    // Default to text/number/email/etc.
    return (
      <Input
        name={name}
        type={q.type || "text"}
        required={q.required !== false}
        value={value}
        onChange={e => handleChange(e, q)}
      />
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Quick Questionnaire</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {questions.map(q => (
            <div key={q.id}>
              <Label htmlFor={q.id}>{q.label}</Label>
              {renderInput(q)}
            </div>
          ))}
          {error && <div style={{ color: "red" }}>{error}</div>}
          <div className="flex justify-end">
            <Button onClick={handleSubmit} disabled={submitting || loading}>
              {submitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Previous Responses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {responses && responses.length > 0 ? (
            responses.map((r) => (
              <div key={r.id} className="flex items-center justify-between border rounded p-2">
                <div>
                  <div className="text-sm text-gray-600">{new Date(r.created_at).toLocaleString()}</div>
                  <div className="font-medium">{r.question_id}</div>
                </div>
                <div>
                  {r.answer_text && <Badge variant="secondary">{r.answer_text}</Badge>}
                  {r.answer_number !== null && r.answer_number !== undefined && (
                    <Badge variant="secondary">{r.answer_number}</Badge>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-600">No responses yet</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default QuestionnairePage


