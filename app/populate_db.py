"""
Script to populate the database with sample perfume data
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))


from user import db
from perfume import Perfume
from sample_perfumes import sample_perfumes
from run import app


def populate_database():
    """Populate the database with sample perfume data"""
    with app.app_context():
        # Create all tables
        db.create_all()

        # Check if perfumes already exist
        if Perfume.query.count() > 0:
            print("Database already contains perfumes. Skipping population.")
            return

        # Add sample perfumes
        for perfume_data in sample_perfumes:
            perfume = Perfume(**perfume_data)
            db.session.add(perfume)

        # Commit all changes
        db.session.commit()
        print(f"Successfully added {len(sample_perfumes)} perfumes to the database.")


if __name__ == "__main__":
    populate_database()
