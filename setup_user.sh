#!/bin/bash

echo "🧪 Setting up Benny user for testing"
echo "==================================="
echo ""

# Check if backend is running
if ! curl -s http://127.0.0.1:8000/ > /dev/null 2>&1; then
    echo "❌ Backend is not running. Please start it first:"
    echo "   python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"
    exit 1
fi

echo "✅ Backend is running"

# Create Benny user
echo "Creating Benny user..."
response=$(curl -s -X POST "http://127.0.0.1:8000/users/" \
    -H "Content-Type: application/json" \
    -d '{
        "username": "benny",
        "email": "benny@example.com",
        "password": "password123",
        "first_name": "Benny",
        "last_name": "User"
    }' 2>/dev/null)

if echo "$response" | grep -q "created successfully"; then
    echo "✅ Benny user created successfully!"

    # Extract user ID from response
    user_id=$(echo "$response" | grep -o '"id":[0-9]*' | grep -o '[0-9]*')
    echo "✅ Benny user ID: $user_id"

    echo ""
    echo "🎉 Setup complete!"
    echo ""
    echo "📱 You can now:"
    echo "   1. Login as Benny (benny@example.com / password123)"
    echo "   2. Complete the questionnaire to create a profile"
    echo "   3. Get AI recommendations on the recommendations page"
    echo ""
    echo "🔗 Frontend: Open your browser and go to the recommendations page"
else
    echo "⚠️  User creation response:"
    echo "$response"
fi
