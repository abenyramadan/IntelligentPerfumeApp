#!/bin/bash
echo "🧪 Intelligent Perfume App - Environment Setup"
echo "=============================================="
echo ""

echo "📝 Setting up environment variables..."
echo ""

# Check if .env file exists
if [ -f ".env" ]; then
    echo "✅ .env file already exists"
    read -p "🔄 Do you want to recreate it? (y/n): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "ℹ️  Keeping existing .env file"
        exit 0
    fi
fi

echo "🔑 Creating .env file..."
echo ""

# Get API key from user
read -p "Enter your Google Gemini API Key: " api_key
echo ""

if [ -z "$api_key" ]; then
    echo "❌ API key cannot be empty!"
    exit 1
fi

# Create .env file
cat > .env << EOF
# AI API Configuration
AI_API_KEY=$api_key

# Database Configuration (optional - defaults to SQLite)
# DATABASE_URL=sqlite:///./perfume_app.db

# For PostgreSQL (uncomment and configure if needed)
# DATABASE_URL=postgresql://username:password@localhost/perfume_db
EOF

echo "✅ .env file created successfully!"
echo ""
echo "🎯 Next steps:"
echo "   1. Your API key has been saved to .env"
echo "   2. Restart your backend server: python3 main.py"
echo "   3. Test recommendations in your app"
echo ""
echo "🧪 Test your setup:"
echo "   curl -X POST http://127.0.0.1:8000/ai/ -H \"Content-Type: application/json\" -d {"user_id": 1}"

