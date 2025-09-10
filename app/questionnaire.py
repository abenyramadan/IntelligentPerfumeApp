from datetime import datetime
from db import db


class QuestionnaireResponse(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    question_id = db.Column(db.String(100), nullable=False)
    answer_text = db.Column(db.Text, nullable=True)
    answer_number = db.Column(db.Float, nullable=True)
    answer_json = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<QuestionnaireResponse {self.id} for User {self.user_id}>"

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "question_id": self.question_id,
            "answer_text": self.answer_text,
            "answer_number": self.answer_number,
            "answer_json": self.answer_json,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
