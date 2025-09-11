import React, { useState } from 'react'

const initialMessages = [
  { from: 'bot', text: "Hi! I'm your scent assistant. I'll ask you a few questions—including about your mood and emotions—to get your perfume recommendation. Ready?" }
]

const questions = [
  { key: 'skin_type', text: 'What is your skin type? (Dry, Balanced, Oily)' },
  { key: 'primary_climate', text: 'What is your primary climate? (Hot & Humid, Hot & Dry, Temperate, Cold)' },
  { key: 'preferred_families', text: 'Which fragrance families do you prefer? (Citrus, Green, Floral, etc. You can list up to 3)' },
  { key: 'allergies', text: 'Do you have any fragrance allergies? (List or say "None")' },
  { key: 'budget_max', text: 'What is your maximum budget in USD?' },
  // Emotional questions
  { key: 'current_mood', text: 'How are you feeling today? (e.g., happy, calm, energetic, stressed, romantic, etc.)' },
  { key: 'desired_feeling', text: 'How do you want your perfume to make you feel? (e.g., confident, relaxed, refreshed, mysterious, etc.)' },
  { key: 'special_occasion', text: 'Is this perfume for a special occasion or daily use?' },
  { key: 'what_the_occasion', text: 'If for a special occasion, what is the occasion? ( wedding, date night, work event, etc.)' },
  { key: 'what_the_time', text: 'If for a special occasion, what time of day is the event? (morning, afternoon, evening)' },
  { key: 'what_the_place', text: 'If for a special occasion, what is the location of the event? (indoor, outdoor, beach, etc.)' },
    { key: 'what_the_day', text: 'If for a special occasion, what is the day of the week?' },
    
  { key: 'usage_frequency', text: 'If for daily use, how often do you plan to wear the perfume? (every day, a few times a week, occasionally)' },
  { key: 'what_the_time', text: 'If for daily use, what time of day do you plan to wear the perfume? (morning, afternoon, evening)' },
  { key: 'what_the_place', text: 'If for daily use, what is the location of the event? (indoor, outdoor, beach, etc.)' },
]

export default function Chatbot({ onComplete }) {
  const [messages, setMessages] = useState(initialMessages)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return
    const currentQ = questions[step]
    const newAnswers = { ...answers, [currentQ.key]: input }
    setMessages([...messages, { from: 'user', text: input }])
    setInput('')
    setAnswers(newAnswers)

    if (step + 1 < questions.length) {
      setTimeout(() => {
        setMessages(msgs => [...msgs, { from: 'bot', text: questions[step + 1].text }])
        setStep(step + 1)
      }, 500)
    } else {
      setLoading(true)
      // Send answers to backend for recommendation
      const res = await fetch(`/api/chatbot/recommendation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAnswers)
      })
      const data = await res.json()
      setLoading(false)
      setMessages(msgs => [
        ...msgs,
        { from: 'bot', text: "Thank you! Here are your recommendations:" },
        { from: 'bot', text: JSON.stringify(data.recommendations, null, 2) }
      ])
      if (onComplete) onComplete(data)
    }
  }

  return (
    <div className="max-w-md mx-auto border rounded p-4 bg-white shadow">
      <div className="h-64 overflow-y-auto mb-2">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.from === 'bot' ? 'text-left text-purple-700' : 'text-right text-gray-700'}>
            <span className="block my-1">{msg.text}</span>
          </div>
        ))}
        {loading && <div className="text-purple-500">Getting your recommendations...</div>}
      </div>
      {!loading && step < questions.length && (
        <div className="flex">
          <input
            className="flex-1 border rounded px-2 py-1"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Type your answer..."
          />
          <button className="ml-2 px-4 py-1 bg-purple-600 text-white rounded" onClick={handleSend}>Send</button>
        </div>
      )}
    </div>
  )
}