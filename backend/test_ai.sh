#!/bin/bash
echo "🧪 AI Recommendation Test Script"
echo "================================"

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo "   Run ./setup_env.sh first to configure your API key"
    exit 1
fi

echo "✅ .env file found"

# Check if AI_API_KEY is set
if ! grep -q "AI_API_KEY=" .env || grep -q "AI_API_KEY=your_google_gemini_api_key_here" .env; then
    echo "❌ AI_API_KEY not configured!"
    echo "   Run ./setup_env.sh first to set your API key"
    exit 1
fi

echo "✅ AI_API_KEY configured"

# Check if backend is running
if ! curl -s http://127.0.0.1:8000/ > /dev/null; then
    echo "❌ Backend server not running!"
    echo "   Start it with: python3 main.py"
    exit 1
fi

echo "✅ Backend server running"

echo ""
echo "🧪 Testing AI recommendation endpoint..."
echo "   (This may take 10-30 seconds for AI to respond)"
echo ""

# Test the AI endpoint
response=$(curl -s -X POST http://127.0.0.1:8000/ai/ \
  -H "Content-Type: application/json" \
  -d '{"user_id": 1, "mood": "neutral", "activity": "general"}')

if echo "$response" | grep -q "success.*true"; then
    echo "🎉 AI RECOMMENDATIONS WORKING!"
    echo ""
    echo "📊 Sample response:"
    echo "$response" | head -5
    echo "..."
    echo ""
    echo "✅ Your app should now show recommendations!"
else
    echo "❌ AI recommendation failed"
    echo "📄 Response: $response"
    echo ""
    echo "💡 Troubleshooting:"
    echo "   - Check your API key is valid"
    echo "   - Check Google Gemini API quota"
    echo "   - Check backend console for detailed errors"
fi

