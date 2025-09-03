import openai
def generate_emotional_question(user_context: dict, prompt: str = None) -> str:
    """
    Uses OpenAI API to generate an emotionally intelligent question or response for the user.
    user_context: dict containing relevant user info (e.g., preferences, recent answers)
    prompt: Optional custom prompt for the AI
    Returns: AI-generated string
    """
    if prompt is None:
        prompt = (
            "You are an emotionally intelligent assistant helping users choose perfumes. "
            "Based on the following user context, ask a thoughtful question to better understand their emotional needs or preferences. "
            "User context: " + str(user_context)
        )
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "system", "content": "You are a helpful, emotionally aware assistant."},
                      {"role": "user", "content": prompt}],
            max_tokens=80,
            temperature=0.7
        )
        return response.choices[0].message['content'].strip()
    except Exception as e:
        return f"Error generating question: {e}"
def get_evaporation_curve(perfume, user_profile):
    """
    Dummy evaporation curve: returns a dict {t: value} for t in hours.
    Real implementation would use note volatility, skin type, temperature, etc.
    """
    # Example: top notes fade quickly, base notes last
    curve = {}
    for t in range(1, 13):
        if t <= 2:
            curve[t] = 0.8  # top notes
        elif t <= 6:
            curve[t] = 0.5  # middle notes
        else:
            curve[t] = 0.3  # base notes
    # Could adjust by skin type, temperature, etc.
    return curve

def get_adaptation_factor(perfume, user_profile):
    """
    Dummy adaptation factor: returns a dict {t: factor} for t in hours.
    Real implementation would use self-anosmia, sensitivities, feedback.
    """
    factor = {}
    anosmia = user_profile.get('self_anosmia_musks', 'No')
    for t in range(1, 13):
        if anosmia == 'Yes':
            factor[t] = 0.7  # reduced pleasantness
        else:
            factor[t] = 1.0
    return factor

def get_sillage_curve(perfume, user_profile):
    """
    Dummy sillage curve: returns a dict {t: value} for t in hours.
    Real implementation would use perfume composition, sprays, environment.
    """
    curve = {}
    sprays = user_profile.get('number_of_sprays', 2)
    for t in range(1, 13):
        curve[t] = 0.5 + 0.05 * sprays  # more sprays, more sillage
        # Could adjust by humidity, airflow, etc.
    return curve
def get_note_weights(perfume, user_profile):
    """
    Assign positive weights for preferred families/notes, negative for disliked, strong negative for allergies.
    perfume: dict from Perfume.to_dict()
    user_profile: dict from UserProfile.to_dict()
    """
    weights = {}
    # Combine all notes
    all_notes = perfume.get('top_notes', []) + perfume.get('middle_notes', []) + perfume.get('base_notes', [])
    preferred = set(user_profile.get('preferred_families', []))
    disliked = set(user_profile.get('disliked_families', []))
    allergies = set(user_profile.get('allergies', []))
    for note in all_notes:
        note = note.strip()
        if note in preferred:
            weights[note] = 1.0
        elif note in disliked:
            weights[note] = -1.0
        else:
            weights[note] = 0.5  # neutral
        if note in allergies:
            weights[note] = -2.0  # strong negative for allergy
    return weights
import numpy as np
import math
from typing import Dict, List, Optional, Any
from .perfume import Perfume
from .user_profile import UserProfile
from .recommendation import Recommendation

class RecommendationEngine:
    """
    AI-powered perfume recommendation engine that implements the utility maximization
    approach from the formulas-perfumes.docx document.
    """
    
    def __init__(self):
        self.fragrance_families = [
            'Citrus', 'Green', 'Aromatic', 'Floral', 'White Floral', 'Fruity',
            'Chypre', 'Woody', 'Amber', 'Oriental/Spicy', 'Leather', 'Musk'
        ]
        
        # Default evaporation rates for different fragrance families (hours^-1)
        self.family_evaporation_rates = {
            'Citrus': 0.8,
            'Green': 0.6,
            'Aromatic': 0.5,
            'Floral': 0.4,
            'White Floral': 0.3,
            'Fruity': 0.7,
            'Chypre': 0.2,
            'Woody': 0.15,
            'Amber': 0.1,
            'Oriental/Spicy': 0.12,
            'Leather': 0.08,
            'Musk': 0.05
        }
        
        # Environmental impact factors
        self.temperature_factors = {
            '<15': 0.7,
            '15-25': 1.0,
            '26-32': 1.3,
            '>32': 1.6
        }
        
        self.humidity_factors = {
            '<30': 1.2,
            '30-60': 1.0,
            '>60': 0.8
        }
        
        self.airflow_factors = {
            'Still': 0.8,
            'Normal': 1.0,
            'Breezy': 1.4
        }
    
    def calculate_personal_weights(self, user_profile: UserProfile) -> Dict[str, float]:
        """Calculate personal weights for fragrance families based on user preferences"""
        weights = {}
        
        # Initialize all families with neutral weight
        for family in self.fragrance_families:
            weights[family] = 0.0
        
        # Positive weights for preferred families
        if user_profile.preferred_families:
            preferred = user_profile.preferred_families.split(',')
            for family in preferred:
                family = family.strip()
                if family in weights:
                    weights[family] = 2.0
        
        # Negative weights for disliked families
        if user_profile.disliked_families:
            disliked = user_profile.disliked_families.split(',')
            for family in disliked:
                family = family.strip()
                if family in weights:
                    weights[family] = -3.0
        
        return weights
    
    def calculate_skin_chemistry_factor(self, user_profile: UserProfile) -> float:
        """Calculate skin chemistry impact on perfume performance"""
        factor = 1.0
        
        # Skin type impact on longevity
        if user_profile.skin_type == 'Oily':
            factor *= 1.3  # Oily skin holds fragrance longer
        elif user_profile.skin_type == 'Dry':
            factor *= 0.7  # Dry skin reduces longevity
        
        # Skin temperature impact
        if user_profile.skin_temperature == 'Warm':
            factor *= 1.2  # Warm skin projects more but may reduce longevity slightly
        elif user_profile.skin_temperature == 'Cool':
            factor *= 0.9
        
        # Hydration impact
        if user_profile.skin_hydration == 'High':
            factor *= 1.1
        elif user_profile.skin_hydration == 'Low':
            factor *= 0.9
        
        return factor
    
    def calculate_environmental_factor(self, user_profile: UserProfile, context: Dict[str, Any]) -> float:
        """Calculate environmental impact on perfume performance"""
        factor = 1.0
        
        # Use context temperature/humidity if provided, otherwise use profile defaults
        temp_key = context.get('temperature_range', user_profile.avg_temperature)
        humidity_key = context.get('humidity_range', user_profile.avg_humidity)
        airflow_key = context.get('airflow', user_profile.airflow or 'Normal')
        
        factor *= self.temperature_factors.get(temp_key, 1.0)
        factor *= self.humidity_factors.get(humidity_key, 1.0)
        factor *= self.airflow_factors.get(airflow_key, 1.0)
        
        return factor
    
    def calculate_pself_curve(self, perfume: Perfume, user_profile: UserProfile, 
                            context: Dict[str, Any], time_hours: float) -> float:
        """
        Calculate self-pleasantness curve Pself(t) based on the formulas document
        """
        personal_weights = self.calculate_personal_weights(user_profile)
        
        # Get base pleasantness from fragrance family preference
        family_weight = personal_weights.get(perfume.fragrance_family, 0.0)
        
        # Base pleasantness (0-10 scale)
        base_pleasantness = 5.0 + family_weight
        
        # Evaporation dynamics - fragrance changes over time
        evaporation_rate = self.family_evaporation_rates.get(perfume.fragrance_family, 0.3)
        
        # Environmental impact
        env_factor = self.calculate_environmental_factor(user_profile, context)
        adjusted_evaporation = evaporation_rate * env_factor
        
        # Note evolution over time (simplified model)
        # Top notes dominate first 2 hours, middle notes 2-6 hours, base notes 6+ hours
        if time_hours <= 2:
            note_factor = 1.0  # Top notes
        elif time_hours <= 6:
            note_factor = 0.8 + 0.2 * math.exp(-(time_hours - 2) * 0.3)  # Transition to middle
        else:
            note_factor = 0.6 + 0.4 * math.exp(-(time_hours - 6) * 0.1)  # Base notes
        
        # Adaptation factor for self-anosmia (especially for musks)
        adaptation_factor = 1.0
        if perfume.fragrance_family == 'Musk' and user_profile.self_anosmia_musks == 'Yes':
            adaptation_factor = max(0.2, 1.0 - time_hours * 0.3)
        
        # Calculate final pleasantness
        pleasantness = base_pleasantness * note_factor * adaptation_factor
        
        # Apply intensity preference
        intensity_match = self._calculate_intensity_match(perfume.intensity, user_profile.preferred_intensity)
        pleasantness *= intensity_match
        
        return max(0, min(10, pleasantness))
    
    def calculate_sillage_curve(self, perfume: Perfume, user_profile: UserProfile, 
                              context: Dict[str, Any], time_hours: float) -> float:
        """
        Calculate projection/sillage curve S(t) based on the formulas document
        """
        # Base sillage from perfume characteristics
        sillage_mapping = {'Light': 2, 'Moderate': 5, 'Heavy': 8}
        base_sillage = sillage_mapping.get(perfume.sillage, 5)
        
        # Environmental impact
        env_factor = self.calculate_environmental_factor(user_profile, context)
        skin_factor = self.calculate_skin_chemistry_factor(user_profile)
        
        # Evaporation rate affects projection
        evaporation_rate = self.family_evaporation_rates.get(perfume.fragrance_family, 0.3)
        
        # Sillage decreases over time due to evaporation
        time_decay = math.exp(-evaporation_rate * env_factor * time_hours)
        
        # Application method impact
        application_factor = 1.0
        if user_profile.spray_location == 'Clothes only':
            application_factor = 1.2  # Clothes hold fragrance longer
        elif user_profile.spray_location == 'Mix':
            application_factor = 1.1
        
        # Number of sprays impact
        spray_factor = min(2.0, user_profile.number_of_sprays / 3.0)
        
        sillage = base_sillage * time_decay * env_factor * skin_factor * application_factor * spray_factor
        
        return max(0, min(10, sillage))
    
    def calculate_utility_score(self, perfume: Perfume, user_profile: UserProfile, 
                              context: Dict[str, Any]) -> Dict[str, float]:
        """
        Calculate utility score using the utility maximization formula from the document
        """
        t1 = user_profile.time_window_start
        t2 = user_profile.time_window_end
        lambda_weight = user_profile.projection_weight
        
        # Sample points for integration (simplified numerical integration)
        time_points = np.linspace(t1, t2, 20)
        dt = (t2 - t1) / 19
        
        total_utility = 0
        avg_pself = 0
        avg_sillage = 0
        
        for t in time_points:
            pself = self.calculate_pself_curve(perfume, user_profile, context, t)
            sillage = self.calculate_sillage_curve(perfume, user_profile, context, t)
            
            utility = pself + lambda_weight * sillage
            total_utility += utility * dt
            avg_pself += pself
            avg_sillage += sillage
        
        avg_pself /= len(time_points)
        avg_sillage /= len(time_points)
        
        # Predicted longevity based on evaporation rate and environmental factors
        evaporation_rate = self.family_evaporation_rates.get(perfume.fragrance_family, 0.3)
        env_factor = self.calculate_environmental_factor(user_profile, context)
        skin_factor = self.calculate_skin_chemistry_factor(user_profile)
        
        predicted_longevity = perfume.longevity_hours * skin_factor / env_factor
        
        return {
            'utility_score': total_utility,
            'predicted_pleasantness': avg_pself,
            'predicted_projection': avg_sillage,
            'predicted_sillage': avg_sillage,
            'predicted_longevity': predicted_longevity
        }
    
    def _calculate_intensity_match(self, perfume_intensity: str, preferred_intensity: str) -> float:
        """Calculate how well perfume intensity matches user preference"""
        intensity_scale = {'Light': 1, 'Moderate': 2, 'Strong': 3}
        perfume_val = intensity_scale.get(perfume_intensity, 2)
        preferred_val = intensity_scale.get(preferred_intensity, 2)
        
        diff = abs(perfume_val - preferred_val)
        return max(0.5, 1.0 - diff * 0.3)
    
    def _apply_filters(self, user_profile: UserProfile) -> List[Perfume]:
        """Apply rule-based filters to exclude unsuitable perfumes"""
        query = Perfume.query
        
        # Budget filter - only apply if explicitly set
        if user_profile.budget_min and user_profile.budget_min > 0:
            query = query.filter(Perfume.price >= user_profile.budget_min)
        if user_profile.budget_max and user_profile.budget_max < 1000:
            query = query.filter(Perfume.price <= user_profile.budget_max)
        
        # Exclude disliked families - only if explicitly set
        if user_profile.disliked_families and len(user_profile.disliked_families) > 0:
            for family in user_profile.disliked_families:
                if family.strip():
                    query = query.filter(~Perfume.fragrance_family.ilike(f'%{family.strip()}%'))
        
        # Exclude allergens - only if explicitly set
        if user_profile.allergies and len(user_profile.allergies) > 0:
            for allergen in user_profile.allergies:
                if allergen.strip():
                    query = query.filter(~Perfume.allergens.ilike(f'%{allergen.strip()}%'))
        
        # Gender presentation filter - only if explicitly set and not empty
        if user_profile.gender_presentation and user_profile.gender_presentation.strip() and user_profile.gender_presentation != 'Unisex':
            query = query.filter(
                (Perfume.gender_presentation == user_profile.gender_presentation) |
                (Perfume.gender_presentation == 'Unisex')
            )
        
        # Seasonal focus filter - only if explicitly set and not empty
        if user_profile.seasonal_focus and user_profile.seasonal_focus.strip() and user_profile.seasonal_focus != 'All-year':
            query = query.filter(
                (Perfume.seasonal_focus == user_profile.seasonal_focus) |
                (Perfume.seasonal_focus == 'All-year')
            )
        
        return query.all()
    
    def get_recommendations(self, user_profile: UserProfile, context: Dict[str, Any], 
                          limit: int = 5) -> List[Dict[str, Any]]:
        """Get top perfume recommendations for a user"""
        # Apply filters
        candidate_perfumes = self._apply_filters(user_profile)
        
        if not candidate_perfumes:
            return []
        
        # Calculate utility scores for all candidates
        scored_perfumes = []
        for perfume in candidate_perfumes:
            scores = self.calculate_utility_score(perfume, user_profile, context)
            scored_perfumes.append({
                'perfume_id': perfume.id,
                'perfume': perfume,
                **scores
            })
        
        # Sort by utility score
        scored_perfumes.sort(key=lambda x: x['utility_score'], reverse=True)
        
        return scored_perfumes[:limit]
    
    def get_daily_recommendation(self, user_profile: UserProfile, 
                               context: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Get a single best recommendation for daily use"""
        recommendations = self.get_recommendations(user_profile, context, limit=1)
        
        if not recommendations:
            return None
        
        rec = recommendations[0]
        
        # Add explanation
        explanation = self._generate_explanation(rec['perfume'], user_profile, context, rec)
        rec['explanation'] = explanation
        
        return rec
    
    def _generate_explanation(self, perfume: Perfume, user_profile: UserProfile, 
                            context: Dict[str, Any], scores: Dict[str, float]) -> str:
        """Generate human-readable explanation for the recommendation"""
        explanations = []
        
        # Family preference
        if user_profile.preferred_families:
            preferred = user_profile.preferred_families.split(',')
            if perfume.fragrance_family in [f.strip() for f in preferred]:
                explanations.append(f"matches your preference for {perfume.fragrance_family} fragrances")
        
        # Environmental suitability
        if context.get('weather'):
            explanations.append(f"suitable for {context['weather']} weather")
        
        # Skin type compatibility
        if user_profile.skin_type == 'Oily' and scores['predicted_longevity'] > 6:
            explanations.append("will have excellent longevity on your oily skin")
        elif user_profile.skin_type == 'Dry':
            explanations.append("formulated to work well with dry skin")
        
        # Activity context
        if context.get('activity'):
            explanations.append(f"appropriate for {context['activity']}")
        
        # Performance prediction
        longevity = scores['predicted_longevity']
        if longevity >= user_profile.longevity_target:
            explanations.append(f"expected to last {longevity:.1f} hours, meeting your target")
        
        if not explanations:
            explanations.append("best overall match for your profile")
        
        return f"This perfume was selected because it " + ", ".join(explanations) + "."
    
    def update_with_feedback(self, recommendation: Recommendation):
        """Update the AI model with user feedback (placeholder for future ML implementation)"""
        # This is where we would implement machine learning model updates
        # based on user feedback. For now, we'll just log the feedback.
        
        # In a full implementation, this would:
        # 1. Update user preference weights based on ratings
        # 2. Adjust environmental factor calculations based on actual performance
        # 3. Refine the utility function parameters
        # 4. Train collaborative filtering models with user similarity data
        
        pass

