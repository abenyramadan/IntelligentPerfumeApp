#!/bin/bash
echo "🧪 Intelligent Perfume App - Database Population"
echo "=============================================="
echo ""

# Check if virtual environment exists
if [ -d "venv" ]; then
    echo "📦 Activating virtual environment..."
    source venv/bin/activate
fi

echo "📋 Populating questionnaire data..."
python3 populate_questionnaires.py

echo ""
echo "🎉 Database population completed!"
echo "📊 You can now visit /questionnaire to see all questions"
echo "💡 Run this script anytime to refresh questionnaire data"

