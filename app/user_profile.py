from .db import db

class UserProfile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Skin/Body Chemistry Data
    skin_type = db.Column(db.String(50), nullable=False)  # Dry, Balanced, Oily
    skin_temperature = db.Column(db.String(50), nullable=False)  # Cool, Neutral, Warm
    skin_hydration = db.Column(db.String(50), nullable=False)  # Low, Medium, High
    skin_ph = db.Column(db.String(50), nullable=True)  # Acidic, Neutral, Alkaline, Unknown
    recent_body_state = db.Column(db.String(100), nullable=True)  # No caffeine/alcohol, Caffeine, Alcohol, Both
    
    # Climate & Environmental Data
    primary_climate = db.Column(db.String(50), nullable=False)  # Hot & Humid, Hot & Dry, Temperate, Cold
    avg_temperature = db.Column(db.String(50), nullable=False)  # <15, 15-25, 26-32, >32
    avg_humidity = db.Column(db.String(50), nullable=False)  # <30, 30-60, >60
    typical_environment = db.Column(db.String(50), nullable=False)  # Outdoor, Indoor-still, Indoor-AC, Indoor-ventilated
    ventilation = db.Column(db.String(50), nullable=True)  # Low, Medium, High
    airflow = db.Column(db.String(50), nullable=True)  # Still, Normal, Breezy
    
    # User Preferences
    preferred_families = db.Column(db.Text, nullable=True)  # Comma-separated list (up to 3)
    disliked_families = db.Column(db.Text, nullable=True)  # Comma-separated list
    preferred_intensity = db.Column(db.String(50), nullable=False)  # Skin scent, Moderate, Strong
    longevity_target = db.Column(db.Integer, nullable=False)  # Hours
    gender_presentation = db.Column(db.String(50), nullable=False)  # Feminine, Masculine, Unisex
    preferred_character = db.Column(db.String(100), nullable=True)  # Fresh/Clean, Smooth/Creamy, etc.
    projection_goal = db.Column(db.String(50), nullable=False)  # Close to skin, Arm's length, Room-filling
    sillage_tolerance_hot = db.Column(db.String(50), nullable=False)  # Low, Medium, High
    seasonal_focus = db.Column(db.String(50), nullable=False)  # Summer, Winter, All-year
    budget_min = db.Column(db.Float, nullable=True)
    budget_max = db.Column(db.Float, nullable=True)
    
    # Sensitivities & Allergies
    allergies = db.Column(db.Text, nullable=True)  # Comma-separated list
    headache_triggers = db.Column(db.Text, nullable=True)  # Comma-separated list
    self_anosmia_musks = db.Column(db.String(50), nullable=True)  # Yes, No, Unsure
    sensitivity_sweetness = db.Column(db.String(50), nullable=False)  # Low, Medium, High
    sensitivity_projection = db.Column(db.String(50), nullable=False)  # Low, Medium, High
    
    # Dose & Application
    number_of_sprays = db.Column(db.Integer, nullable=False)
    preferred_concentration = db.Column(db.String(50), nullable=False)  # EDT, EDP, Parfum, Extrait
    spray_location = db.Column(db.String(50), nullable=False)  # Skin only, Clothes only, Mix
    fabric_type = db.Column(db.String(50), nullable=True)  # Cotton, Wool, Synthetic, Blend
    
    # Decision Window & Weighting
    time_window_start = db.Column(db.Integer, nullable=False)  # Hours
    time_window_end = db.Column(db.Integer, nullable=False)  # Hours
    projection_weight = db.Column(db.Float, nullable=False)  # Lambda value (0.2, 1.0, 2.0)
    
    def __repr__(self):
        return f'<UserProfile for User {self.user_id}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'skin_type': self.skin_type,
            'skin_temperature': self.skin_temperature,
            'skin_hydration': self.skin_hydration,
            'skin_ph': self.skin_ph,
            'recent_body_state': self.recent_body_state,
            'primary_climate': self.primary_climate,
            'avg_temperature': self.avg_temperature,
            'avg_humidity': self.avg_humidity,
            'typical_environment': self.typical_environment,
            'ventilation': self.ventilation,
            'airflow': self.airflow,
            'preferred_families': self.preferred_families.split(',') if self.preferred_families else [],
            'disliked_families': self.disliked_families.split(',') if self.disliked_families else [],
            'preferred_intensity': self.preferred_intensity,
            'longevity_target': self.longevity_target,
            'gender_presentation': self.gender_presentation,
            'preferred_character': self.preferred_character,
            'projection_goal': self.projection_goal,
            'sillage_tolerance_hot': self.sillage_tolerance_hot,
            'seasonal_focus': self.seasonal_focus,
            'budget_min': self.budget_min,
            'budget_max': self.budget_max,
            'allergies': self.allergies.split(',') if self.allergies else [],
            'headache_triggers': self.headache_triggers.split(',') if self.headache_triggers else [],
            'self_anosmia_musks': self.self_anosmia_musks,
            'sensitivity_sweetness': self.sensitivity_sweetness,
            'sensitivity_projection': self.sensitivity_projection,
            'number_of_sprays': self.number_of_sprays,
            'preferred_concentration': self.preferred_concentration,
            'spray_location': self.spray_location,
            'fabric_type': self.fabric_type,
            'time_window_start': self.time_window_start,
            'time_window_end': self.time_window_end,
            'projection_weight': self.projection_weight
        }

