#!/bin/bash

echo "🧪 Production Health Check - AI Fragrance Recommender"
echo "====================================================="
echo ""

# Check if backend is running
echo "📡 Checking backend status..."
if curl -s http://127.0.0.1:8000/ > /dev/null 2>&1; then
    echo "✅ Backend service is running"
else
    echo "❌ Backend service is not running"
    echo "💡 To start: cd backend && python -m uvicorn main:app --host 0.0.0.0 --port 8000"
    exit 1
fi

echo ""
echo "🔑 Checking environment configuration..."

# Check if .env file exists
if [ -f "backend/.env" ]; then
    echo "✅ Environment configuration found"
    if grep -q "AI_API_KEY" backend/.env; then
        echo "✅ AI service configured"
    else
        echo "⚠️  AI_API_KEY not configured"
        echo "💡 To configure: cd backend && ./setup_env.sh"
    fi
else
    echo "⚠️  Environment file not found"
    echo "💡 To configure: cd backend && ./setup_env.sh"
fi

echo ""
echo "🗄️  Database status..."

# Check if database exists
if [ -f "backend/perfume_app.db" ]; then
    echo "✅ Database file exists"
else
    echo "⚠️  Database not found - will be created on first request"
fi

echo ""
echo "🧪 Testing AI recommendation endpoint..."

# Test AI endpoint
response=$(curl -s -X POST "http://127.0.0.1:8000/ai/" \
    -H "Content-Type: application/json" \
    -d '{
        "user_id": 1,
        "mood": "Happy",
        "activity": "Casual",
        "primary_climate": "Temperate",
        "temperature": 22,
        "humidity": 50
    }' 2>/dev/null)

if [ $? -eq 0 ]; then
    echo "✅ AI endpoint is responding"

    if echo "$response" | grep -q "success"; then
        echo "✅ AI recommendation service is fully operational"
        echo ""
        echo "🎉 System ready for production use!"
    else
        echo "⚠️  AI service returned an error"
        echo "Response: $response"
    fi
else
    echo "❌ Cannot connect to AI endpoint"
fi

echo ""
echo "📋 System Status Summary:"
echo "   • Backend API: $(curl -s http://127.0.0.1:8000/ > /dev/null 2>&1 && echo '✅ Running' || echo '❌ Stopped')"
echo "   • AI Service: $(if [ -f "backend/.env" ] && grep -q "AI_API_KEY" backend/.env; then echo '✅ Configured'; else echo '⚠️  Not configured'; fi)"
echo "   • Database: $([ -f "backend/perfume_app.db" ] && echo '✅ Ready' || echo '⚠️  Will be created')"
