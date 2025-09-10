from sqlalchemy import String, Integer, ForeignKey, Column, DateTime, Float, Text


from .core import Base
from datetime import datetime


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String(50), index=True)
    email = Column(String(60), nullable=False)
    password = Column(String)
    created_at = Column(DateTime, default=datetime.now)


class UserProfile(Base):
    __tablename__ = "user_profiles"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Skin/Body Chemistry Data
    skin_type = Column(String(50), nullable=False)  # Dry, Balanced, Oily
    skin_temperature = Column(String(50), nullable=False)  # Cool, Neutral, Warm
    skin_hydration = Column(String(50), nullable=False)  # Low, Medium, High
    skin_ph = Column(String(50), nullable=True)  # Acidic, Neutral, Alkaline, Unknown
    recent_body_state = Column(
        String(100), nullable=True
    )  # No caffeine/alcohol, Caffeine, Alcohol, Both

    # Climate & Environmental Data
    primary_climate = Column(
        String(50), nullable=False
    )  # Hot & Humid, Hot & Dry, Temperate, Cold
    avg_temperature = Column(String(50), nullable=False)  # <15, 15-25, 26-32, >32
    avg_humidity = Column(String(50), nullable=False)  # <30, 30-60, >60
    typical_environment = Column(
        String(50), nullable=False
    )  # Outdoor, Indoor-still, Indoor-AC, Indoor-ventilated
    ventilation = Column(String(50), nullable=True)  # Low, Medium, High
    airflow = Column(String(50), nullable=True)  # Still, Normal, Breezy

    # User Preferences
    preferred_families = Column(Text, nullable=True)  # Comma-separated list (up to 3)
    disliked_families = Column(Text, nullable=True)  # Comma-separated list
    preferred_intensity = Column(
        String(50), nullable=False
    )  # Skin scent, Moderate, Strong
    longevity_target = Column(Integer, nullable=False)  # Hours
    gender_presentation = Column(
        String(50), nullable=False
    )  # Feminine, Masculine, Unisex
    preferred_character = Column(
        String(100), nullable=True
    )  # Fresh/Clean, Smooth/Creamy, etc.
    projection_goal = Column(
        String(50), nullable=False
    )  # Close to skin, Arm's length, Room-filling
    sillage_tolerance_hot = Column(String(50), nullable=False)  # Low, Medium, High
    seasonal_focus = Column(String(50), nullable=False)  # Summer, Winter, All-year
    budget_min = Column(Float, nullable=True)
    budget_max = Column(Float, nullable=True)

    # Sensitivities & Allergies
    allergies = Column(Text, nullable=True)  # Comma-separated list
    headache_triggers = Column(Text, nullable=True)  # Comma-separated list
    self_anosmia_musks = Column(String(50), nullable=True)  # Yes, No, Unsure
    sensitivity_sweetness = Column(String(50), nullable=False)  # Low, Medium, High
    sensitivity_projection = Column(String(50), nullable=False)  # Low, Medium, High

    # Dose & Application
    number_of_sprays = Column(Integer, nullable=False)
    preferred_concentration = Column(
        String(50), nullable=False
    )  # EDT, EDP, Parfum, Extrait
    spray_location = Column(String(50), nullable=False)  # Skin only, Clothes only, Mix
    fabric_type = Column(String(50), nullable=True)  # Cotton, Wool, Synthetic, Blend

    # Decision Window & Weighting
    time_window_start = Column(Integer, nullable=False)  # Hours
    time_window_end = Column(Integer, nullable=False)  # Hours
    projection_weight = Column(Float, nullable=False)  # Lambda value (0.2, 1.0, 2.0)

    def __repr__(self):
        return f"<UserProfile for User {self.user_id}>"

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "skin_type": self.skin_type,
            "skin_temperature": self.skin_temperature,
            "skin_hydration": self.skin_hydration,
            "skin_ph": self.skin_ph,
            "recent_body_state": self.recent_body_state,
            "primary_climate": self.primary_climate,
            "avg_temperature": self.avg_temperature,
            "avg_humidity": self.avg_humidity,
            "typical_environment": self.typical_environment,
            "ventilation": self.ventilation,
            "airflow": self.airflow,
            "preferred_families": (
                self.preferred_families.split(",") if self.preferred_families else []
            ),
            "disliked_families": (
                self.disliked_families.split(",") if self.disliked_families else []
            ),
            "preferred_intensity": self.preferred_intensity,
            "longevity_target": self.longevity_target,
            "gender_presentation": self.gender_presentation,
            "preferred_character": self.preferred_character,
            "projection_goal": self.projection_goal,
            "sillage_tolerance_hot": self.sillage_tolerance_hot,
            "seasonal_focus": self.seasonal_focus,
            "budget_min": self.budget_min,
            "budget_max": self.budget_max,
            "allergies": self.allergies.split(",") if self.allergies else [],
            "headache_triggers": (
                self.headache_triggers.split(",") if self.headache_triggers else []
            ),
            "self_anosmia_musks": self.self_anosmia_musks,
            "sensitivity_sweetness": self.sensitivity_sweetness,
            "sensitivity_projection": self.sensitivity_projection,
            "number_of_sprays": self.number_of_sprays,
            "preferred_concentration": self.preferred_concentration,
            "spray_location": self.spray_location,
            "fabric_type": self.fabric_type,
            "time_window_start": self.time_window_start,
            "time_window_end": self.time_window_end,
            "projection_weight": self.projection_weight,
        }


class QuestionnaireResponse(Base):
    __tablename__ = "questionnaire_reponses"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    question_id = Column(String(100), nullable=False)
    answer_text = Column(Text, nullable=True)
    answer_number = Column(Float, nullable=True)
    answer_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

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


class Perfume(Base):
    __tablename__ = "perfumes"
    id = Column(Integer, primary_key=True)
    name = Column(String(200), nullable=False)
    brand = Column(String(100), nullable=False)
    concentration = Column(String(50), nullable=False)  # EDT, EDP, Parfum, Extrait
    price = Column(Float, nullable=True)

    # Fragrance characteristics
    fragrance_family = Column(String(100), nullable=False)
    intensity = Column(String(50), nullable=False)  # Light, Moderate, Strong
    longevity_hours = Column(Integer, nullable=False)
    projection = Column(String(50), nullable=False)  # Close, Moderate, Strong
    sillage = Column(String(50), nullable=False)  # Light, Moderate, Heavy

    # Notes (stored as comma-separated strings for simplicity)
    top_notes = Column(Text, nullable=True)
    middle_notes = Column(Text, nullable=True)
    base_notes = Column(Text, nullable=True)

    # Seasonal and gender information
    seasonal_focus = Column(String(50), nullable=False)  # Summer, Winter, All-year
    gender_presentation = Column(
        String(50), nullable=False
    )  # Masculine, Feminine, Unisex

    # Ingredients that might cause allergies (comma-separated)
    allergens = Column(Text, nullable=True)
    image_url = Column(String(300), nullable=True)

    def __repr__(self):
        return f"<Perfume {self.brand} - {self.name}>"

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "brand": self.brand,
            "concentration": self.concentration,
            "price": self.price,
            "fragrance_family": self.fragrance_family,
            "intensity": self.intensity,
            "longevity_hours": self.longevity_hours,
            "projection": self.projection,
            "sillage": self.sillage,
            "top_notes": self.top_notes.split(",") if self.top_notes else [],
            "middle_notes": self.middle_notes.split(",") if self.middle_notes else [],
            "base_notes": self.base_notes.split(",") if self.base_notes else [],
            "seasonal_focus": self.seasonal_focus,
            "gender_presentation": self.gender_presentation,
            "allergens": self.allergens.split(",") if self.allergens else [],
            "image_url": self.image_url,
        }


class Recommendation(Base):
    __tablename__ = "recommendations"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    perfume_id = Column(Integer, ForeignKey("perfumes.id"), nullable=False)

    # Recommendation context
    recommendation_date = Column(DateTime, default=datetime.utcnow)
    context_mood = Column(String(100), nullable=True)
    context_activity = Column(String(200), nullable=True)
    context_weather = Column(String(100), nullable=True)
    context_temperature = Column(Float, nullable=True)
    context_humidity = Column(Float, nullable=True)

    # AI prediction scores
    predicted_longevity = Column(Float, nullable=True)  # Hours
    predicted_projection = Column(Float, nullable=True)  # Scale 1-10
    predicted_sillage = Column(Float, nullable=True)  # Scale 1-10
    predicted_pleasantness = Column(Float, nullable=True)  # Scale 1-10
    utility_score = Column(Float, nullable=True)  # Overall utility score

    # User feedback
    user_rating = Column(Integer, nullable=True)  # 1-5 stars
    actual_longevity = Column(Float, nullable=True)  # Hours reported by user
    actual_projection = Column(Integer, nullable=True)  # 1-10 scale
    actual_sillage = Column(Integer, nullable=True)  # 1-10 scale
    user_notes = Column(Text, nullable=True)  # Free text feedback
    feedback_date = Column(DateTime, nullable=True)

    def __repr__(self):
        return f"<Recommendation {self.id} for User {self.user_id}>"

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "perfume_id": self.perfume_id,
            "recommendation_date": (
                self.recommendation_date.isoformat()
                if self.recommendation_date
                else None
            ),
            "context_mood": self.context_mood,
            "context_activity": self.context_activity,
            "context_weather": self.context_weather,
            "context_temperature": self.context_temperature,
            "context_humidity": self.context_humidity,
            "predicted_longevity": self.predicted_longevity,
            "predicted_projection": self.predicted_projection,
            "predicted_sillage": self.predicted_sillage,
            "predicted_pleasantness": self.predicted_pleasantness,
            "utility_score": self.utility_score,
            "user_rating": self.user_rating,
            "actual_longevity": self.actual_longevity,
            "actual_projection": self.actual_projection,
            "actual_sillage": self.actual_sillage,
            "user_notes": self.user_notes,
            "feedback_date": (
                self.feedback_date.isoformat() if self.feedback_date else None
            ),
        }
