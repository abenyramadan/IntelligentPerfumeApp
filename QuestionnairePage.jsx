import { useEffect, useState } from 'react'
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

const QuestionnairePage = ({ userId: propUserId }) => {
  const resolvedUserId = propUserId || getCurrentUserId()
  const { responses, loading, submitResponse } = useQuestionnaire(resolvedUserId)
  const [answers, setAnswers] = useState({})
  const [questions, setQuestions] = useState([])

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
  }

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
              {q.type === 'select' && !q.multiple && (
                <Select
                  value={answers[q.id] || ""}
                  onValueChange={(v) => handleChange(q.id, v)}
                >
                  <SelectContent>
                    {q.options?.map(opt => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {q.type === 'select' && q.multiple && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {q.options?.map(opt => (
                    <div key={opt} className="flex items-center space-x-2">
                      <Checkbox id={`${q.id}-${opt}`} checked={(answers[q.id]||[]).includes(opt)} onCheckedChange={() => toggleMultiSelect(q.id, opt, q.max)} />
                      <Label htmlFor={`${q.id}-${opt}`} className="text-sm">{opt}</Label>
                    </div>
                  ))}
                </div>
              )}
              {q.type === 'number' && (
                <Input type="number" min={q.min} max={q.max} step={q.step||1} onChange={(e)=>handleChange(q.id, e.target.value)} />
              )}
              {(!q.type || q.type === 'text') && (
                <Input onChange={(e)=>handleChange(q.id, e.target.value)} />
              )}
            </div>
          ))}
          <div className="flex justify-end">
            <Button onClick={handleSubmit} disabled={loading}>Submit</Button>
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


