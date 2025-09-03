from .db import db
from datetime import datetime

class Recommendation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    perfume_id = db.Column(db.Integer, db.ForeignKey('perfume.id'), nullable=False)
    
    # Recommendation context
    recommendation_date = db.Column(db.DateTime, default=datetime.utcnow)
    context_mood = db.Column(db.String(100), nullable=True)
    context_activity = db.Column(db.String(200), nullable=True)
    context_weather = db.Column(db.String(100), nullable=True)
    context_temperature = db.Column(db.Float, nullable=True)
    context_humidity = db.Column(db.Float, nullable=True)
    
    # AI prediction scores
    predicted_longevity = db.Column(db.Float, nullable=True)  # Hours
    predicted_projection = db.Column(db.Float, nullable=True)  # Scale 1-10
    predicted_sillage = db.Column(db.Float, nullable=True)  # Scale 1-10
    predicted_pleasantness = db.Column(db.Float, nullable=True)  # Scale 1-10
    utility_score = db.Column(db.Float, nullable=True)  # Overall utility score
    
    # User feedback
    user_rating = db.Column(db.Integer, nullable=True)  # 1-5 stars
    actual_longevity = db.Column(db.Float, nullable=True)  # Hours reported by user
    actual_projection = db.Column(db.Integer, nullable=True)  # 1-10 scale
    actual_sillage = db.Column(db.Integer, nullable=True)  # 1-10 scale
    user_notes = db.Column(db.Text, nullable=True)  # Free text feedback
    feedback_date = db.Column(db.DateTime, nullable=True)
    
    def __repr__(self):
        return f'<Recommendation {self.id} for User {self.user_id}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'perfume_id': self.perfume_id,
            'recommendation_date': self.recommendation_date.isoformat() if self.recommendation_date else None,
            'context_mood': self.context_mood,
            'context_activity': self.context_activity,
            'context_weather': self.context_weather,
            'context_temperature': self.context_temperature,
            'context_humidity': self.context_humidity,
            'predicted_longevity': self.predicted_longevity,
            'predicted_projection': self.predicted_projection,
            'predicted_sillage': self.predicted_sillage,
            'predicted_pleasantness': self.predicted_pleasantness,
            'utility_score': self.utility_score,
            'user_rating': self.user_rating,
            'actual_longevity': self.actual_longevity,
            'actual_projection': self.actual_projection,
            'actual_sillage': self.actual_sillage,
            'user_notes': self.user_notes,
            'feedback_date': self.feedback_date.isoformat() if self.feedback_date else None
        }

