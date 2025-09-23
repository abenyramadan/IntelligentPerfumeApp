#!/usr/bin/env python3
"""
Questionnaire Data Population Script
Run this script to populate the questionnaire table with sample data.
Usage: python populate_questionnaires.py
"""

import sys
import os

# Add backend directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from db.core import get_session
from db.models import Questionnaire

# Comprehensive questionnaire data
QUESTIONNAIRE_DATA = [
    # Skin Chemistry (Questions 1-5)
    {
        'question_id': '1',
        'question_text': 'What is your skin type?',
        'question_topic': 'Skin Chemistry',
        'multiple_choices': 'Dry,Oily,Balanced',
        'type': 'select',
        'can_select_multiple': False
    },
    {
        'question_id': '2',
        'question_text': 'What is your skin temperature?',
        'question_topic': 'Skin Chemistry',
        'multiple_choices': 'Cool,Neutral,Warm',
        'type': 'select',
        'can_select_multiple': False
    },
    {
        'question_id': '3',
        'question_text': 'How would you describe your skin hydration?',
        'question_topic': 'Skin Chemistry',
        'multiple_choices': 'Low,Medium,High',
        'type': 'select',
        'can_select_multiple': False
    },
    {
        'question_id': '4',
        'question_text': 'What is your skin pH level?',
        'question_topic': 'Skin Chemistry',
        'multiple_choices': 'Acidic,Neutral,Alkaline,Unknown',
        'type': 'select',
        'can_select_multiple': False
    },
    {
        'question_id': '5',
        'question_text': 'Have you consumed caffeine or alcohol recently?',
        'question_topic': 'Skin Chemistry',
        'multiple_choices': 'No caffeine/alcohol,Caffeine,Alcohol,Both',
        'type': 'select',
        'can_select_multiple': False
    },

    # Environment & Climate (Questions 6-11)
    {
        'question_id': '6',
        'question_text': 'What is your primary climate?',
        'question_topic': 'Environment',
        'multiple_choices': 'Hot & Humid,Hot & Dry,Temperate,Cold',
        'type': 'select',
        'can_select_multiple': False
    },
    {
        'question_id': '7',
        'question_text': 'What is your average temperature range?',
        'question_topic': 'Environment',
        'multiple_choices': '<15°C,15-25°C,26-32°C,>32°C',
        'type': 'select',
        'can_select_multiple': False
    },
    {
        'question_id': '8',
        'question_text': 'What is your average humidity level?',
        'question_topic': 'Environment',
        'multiple_choices': '<30%,30-60%,>60%',
        'type': 'select',
        'can_select_multiple': False
    },
    {
        'question_id': '9',
        'question_text': 'What is your typical environment?',
        'question_topic': 'Environment',
        'multiple_choices': 'Outdoor,Indoor-still,Indoor-AC,Indoor-ventilated',
        'type': 'select',
        'can_select_multiple': False
    },
    {
        'question_id': '10',
        'question_text': 'What is the ventilation level?',
        'question_topic': 'Environment',
        'multiple_choices': 'Low,Medium,High',
        'type': 'select',
        'can_select_multiple': False
    },
    {
        'question_id': '11',
        'question_text': 'How would you describe the airflow?',
        'question_topic': 'Environment',
        'multiple_choices': 'Still,Normal,Breezy',
        'type': 'select',
        'can_select_multiple': False
    },

    # Preferences (Questions 12-20)
    {
        'question_id': '12',
        'question_text': 'Which fragrance families do you prefer? (Select up to 3)',
        'question_topic': 'Preferences',
        'multiple_choices': 'Woody,Aromatic,Floral,Fruity,Citrus,Spicy,Oriental,Fresh,Gourmand,Green, None',
        'type': 'select',
        'can_select_multiple': True
    },
    {
        'question_id': '13',
        'question_text': 'Which fragrance families do you dislike?',
        'question_topic': 'Preferences',
        'multiple_choices': 'Woody,Aromatic,Floral,Fruity,Citrus,Spicy,Oriental,Fresh,Gourmand,Green,None',
        'type': 'select',
        'can_select_multiple': True
    },
    {
        'question_id': '14',
        'question_text': 'What intensity do you prefer?',
        'question_topic': 'Preferences',
        'multiple_choices': 'Skin scent,Moderate,Strong',
        'type': 'select',
        'can_select_multiple': False
    },
    {
        'question_id': '15',
        'question_text': 'What is your target longevity (hours)?',
        'question_topic': 'Preferences',
        'multiple_choices': '2-4,4-8,8-12,12-24,24+',
        'type': 'select',
        'can_select_multiple': False
    },
    {
        'question_id': '16',
        'question_text': 'What is your gender presentation?',
        'question_topic': 'Preferences',
        'multiple_choices': 'Feminine,Masculine,Unisex',
        'type': 'select',
        'can_select_multiple': False
    },
    {
        'question_id': '17',
        'question_text': 'What character do you prefer?',
        'question_topic': 'Preferences',
        'multiple_choices': 'Fresh/Clean,Smooth/Creamy,Rich/Deep,Bold/Powerful,Light/Airy,Sweet/Playful',
        'type': 'select',
        'can_select_multiple': False
    },
    {
        'question_id': '18',
        'question_text': 'What projection goal do you have?',
        'question_topic': 'Preferences',
        'multiple_choices': 'Close to skin,Arms length,Room-filling',
        'type': 'select',
        'can_select_multiple': False
    },
    {
        'question_id': '19',
        'question_text': 'What is your sillage tolerance in hot weather?',
        'question_topic': 'Preferences',
        'multiple_choices': 'Low,Medium,High',
        'type': 'select',
        'can_select_multiple': False
    },
    {
        'question_id': '20',
        'question_text': 'When do you prefer to wear fragrances?',
        'question_topic': 'Preferences',
        'multiple_choices': 'Summer,Winter,All-year',
        'type': 'select',
        'can_select_multiple': False
    },

    # Budget & Sensitivities (Questions 21-27)
    {
        'question_id': '21',
        'question_text': 'What is your minimum budget?',
        'question_topic': 'Budget',
        'multiple_choices': '0,25,50,100,200,500',
        'type': 'select',
        'can_select_multiple': False
    },
    {
        'question_id': '22',
        'question_text': 'What is your maximum budget?',
        'question_topic': 'Budget',
        'multiple_choices': '50,100,200,500,1000,2000+',
        'type': 'select',
        'can_select_multiple': False
    },
    {
        'question_id': '23',
        'question_text': 'Do you have any allergies? (Select all that apply)',
        'question_topic': 'Sensitivities',
        'multiple_choices': 'None,Lavender,Rose,Jasmine,Cinnamon,Vanilla,Musk,Amber,Oakmoss,Patchouli',
        'type': 'select',
        'can_select_multiple': True
    },
    {
        'question_id': '24',
        'question_text': 'What triggers your headaches?',
        'question_topic': 'Sensitivities',
        'multiple_choices': 'None,Strong florals,Heavy spices,Sweet notes,Animalic notes,Smoky notes',
        'type': 'select',
        'can_select_multiple': True
    },
    {
        'question_id': '25',
        'question_text': 'Are you anosmic to musks?',
        'question_topic': 'Sensitivities',
        'multiple_choices': 'Yes,No,Unsure',
        'type': 'select',
        'can_select_multiple': False
    },
    {
        'question_id': '26',
        'question_text': 'How sensitive are you to sweetness?',
        'question_topic': 'Sensitivities',
        'multiple_choices': 'Low,Medium,High',
        'type': 'select',
        'can_select_multiple': False
    },
    {
        'question_id': '27',
        'question_text': 'How sensitive are you to projection?',
        'question_topic': 'Sensitivities',
        'multiple_choices': 'Low,Medium,High',
        'type': 'select',
        'can_select_multiple': False
    },

    # Application (Questions 28-34)
    {
        'question_id': '28',
        'question_text': 'How many sprays do you typically use?',
        'question_topic': 'Application',
        'multiple_choices': '1,2,3,4,5,6,7,8,9,10+',
        'type': 'select',
        'can_select_multiple': False
    },
    {
        'question_id': '29',
        'question_text': 'What concentration do you prefer?',
        'question_topic': 'Application',
        'multiple_choices': 'EDT,EDP,Parfum,Extrait',
        'type': 'select',
        'can_select_multiple': False
    },
    {
        'question_id': '30',
        'question_text': 'Where do you typically spray?',
        'question_topic': 'Application',
        'multiple_choices': 'Skin only,Clothes only,Mix',
        'type': 'select',
        'can_select_multiple': False
    },
    {
        'question_id': '31',
        'question_text': 'What type of fabric do you wear most?',
        'question_topic': 'Application',
        'multiple_choices': 'Cotton,Wool,Synthetic,Blend',
        'type': 'select',
        'can_select_multiple': False
    },
    {
        'question_id': '32',
        'question_text': 'What time do you start wearing fragrance?',
        'question_topic': 'Application',
        'multiple_choices': '0,6,8,10,12,14,16,18,20,22',
        'type': 'select',
        'can_select_multiple': False
    },
    {
        'question_id': '33',
        'question_text': 'What time do you stop wearing fragrance?',
        'question_topic': 'Application',
        'multiple_choices': '6,12,18,24',
        'type': 'select',
        'can_select_multiple': False
    },
    {
        'question_id': '34',
        'question_text': 'How important is projection in your fragrance choice?',
        'question_topic': 'Application',
        'multiple_choices': '0.2,1.0,2.0',
        'type': 'select',
        'can_select_multiple': False
    }
]

def populate_questionnaires():
    """Populate the questionnaire table with sample data"""
    with get_session() as session:
        try:
            print(f"📋 Adding {len(QUESTIONNAIRE_DATA)} questionnaire questions...")

            questions_added = 0
            for q_data in QUESTIONNAIRE_DATA:
                # Check if question already exists
                existing = session.query(Questionnaire).filter_by(
                    question_id=q_data['question_id']
                ).first()

                if not existing:
                    question = Questionnaire(**q_data)
                    session.add(question)
                    questions_added += 1
                    print(f"  ✅ Added Q{q_data['question_id']}: {q_data['question_text'][:50]}...")
                else:
                    print(f"  ⏭️  Skipped Q{q_data['question_id']}: Already exists")

            session.commit()
            print(f"\n🎉 Successfully processed {len(QUESTIONNAIRE_DATA)} questions!")
            print(f"   ➕ Added {questions_added} new questions")
            print(f"   ⏭️  Skipped {len(QUESTIONNAIRE_DATA) - questions_added} existing questions")

            # Verify final count
            total_count = session.query(Questionnaire).count()
            print(f"   📊 Total questions in database: {total_count}")

            return True

        except Exception as e:
            print(f"❌ Error: {e}")
            session.rollback()
            return False

def clear_questionnaires():
    """Clear all questionnaire data (for testing)"""
    with get_session() as session:
        try:
            count = session.query(Questionnaire).count()
            session.query(Questionnaire).delete()
            session.commit()
            print(f"🗑️  Cleared {count} questionnaire questions")
            return True
        except Exception as e:
            print(f"❌ Error clearing questionnaires: {e}")
            session.rollback()
            return False

if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Manage questionnaire data")
    parser.add_argument("--clear", action="store_true", help="Clear all questionnaires first")
    parser.add_argument("--populate", action="store_true", help="Populate questionnaires (default)")
    parser.add_argument("--count", action="store_true", help="Show current count")

    args = parser.parse_args()

    if args.count:
        # Just show count
        with get_session() as session:
            count = session.query(Questionnaire).count()
            print(f"📊 Current questionnaire count: {count}")
    elif args.clear:
        # Clear and populate
        print("🧹 Clearing existing questionnaires...")
        if clear_questionnaires():
            print("✅ Cleared successfully")
            if populate_questionnaires():
                print("🎉 Population completed!")
    else:
        # Default: populate
        if populate_questionnaires():
            print("🎉 Questionnaire population completed successfully!")
        else:
            print("❌ Failed to populate questionnaires")
            sys.exit(1)
