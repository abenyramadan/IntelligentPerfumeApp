from .db import db

class Perfume(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    brand = db.Column(db.String(100), nullable=False)
    concentration = db.Column(db.String(50), nullable=False)  # EDT, EDP, Parfum, Extrait
    price = db.Column(db.Float, nullable=True)
    
    # Fragrance characteristics
    fragrance_family = db.Column(db.String(100), nullable=False)
    intensity = db.Column(db.String(50), nullable=False)  # Light, Moderate, Strong
    longevity_hours = db.Column(db.Integer, nullable=False)
    projection = db.Column(db.String(50), nullable=False)  # Close, Moderate, Strong
    sillage = db.Column(db.String(50), nullable=False)  # Light, Moderate, Heavy
    
    # Notes (stored as comma-separated strings for simplicity)
    top_notes = db.Column(db.Text, nullable=True)
    middle_notes = db.Column(db.Text, nullable=True)
    base_notes = db.Column(db.Text, nullable=True)
    
    # Seasonal and gender information
    seasonal_focus = db.Column(db.String(50), nullable=False)  # Summer, Winter, All-year
    gender_presentation = db.Column(db.String(50), nullable=False)  # Masculine, Feminine, Unisex
    
    # Ingredients that might cause allergies (comma-separated)
    allergens = db.Column(db.Text, nullable=True)
    image_url = db.Column(db.String(300), nullable=True)
    
    def __repr__(self):
        return f'<Perfume {self.brand} - {self.name}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'brand': self.brand,
            'concentration': self.concentration,
            'price': self.price,
            'fragrance_family': self.fragrance_family,
            'intensity': self.intensity,
            'longevity_hours': self.longevity_hours,
            'projection': self.projection,
            'sillage': self.sillage,
            'top_notes': self.top_notes.split(',') if self.top_notes else [],
            'middle_notes': self.middle_notes.split(',') if self.middle_notes else [],
            'base_notes': self.base_notes.split(',') if self.base_notes else [],
            'seasonal_focus': self.seasonal_focus,
            'gender_presentation': self.gender_presentation,
            'allergens': self.allergens.split(',') if self.allergens else [],
            'image_url': self.image_url
        }

