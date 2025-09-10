from pydantic import BaseModel


class UserProfileSchema(BaseModel):
    user_id: int

    # skin chemistry
    skin_type: str  # dry, oily, balance
    skin_temperature: str  # cool, neutral, warm
    skin_hydration: str  # low, medium, high
    skin_ph: str | None = None  # acidic, neutral, alkaline, unknown
    recent_body_state: str | None = None  # caffeine, alcohol, sober or both(drunk dude)

    # climate and environ

    primary_climate: str  # hot, dry, temperate, cold
    avg_temperature: str  # <15,15-25, 26-42, >32
    avg_humidity: str  # <30, 30-60 >60
    typical_environment: str  # outdoor, indoor, indoor-AC
    ventilation: str | None = None  # low, medium, high
    airflow: str | None = None  # still, normal, breezy

    # user preferences
    preferred_families: str | None = None  # comma seperated values
    disliked_families: str | None = None  # same comma seperated
    preferred_instensity: str  # skin scent, moderate, strong
    longevity_target: int  # hours
    gender_presentation: str  # feminine, masculine unisex
    preferred_character: str | None = None  # fresh/clean, smooth/creamy
    projection_goal: str  # close to skin, arm length, room filling
    sillage_tolerance_hot: str  # low, medium, high
    seasonal_focus: str  # summer, winter all-year
    budget_min: float | None = None
    budget_max: float | None = None

    # sensitivities and allergies
    allergies: str | None = None  # comma seperate stuff
    headache_triggers: str | None = None
    self_anosmia_musks: str | None = None  # yes, no, unsure
    sensitivity_sweetness: str  # low,medium, high
    sensitivity_projection: str  # low, med, high

    # does and application
    number_of_sprays: int
    preferred_concentration: str  # EDT, EDP, perfum, Extrait
    spray_location: str  # skin only, clothes only, mix
    fabric_type: str | None = None  # cotton, wool, blend, synthetic

    # decision windown n weighting
    time_window_start: int  # hours
    time_window_end: int
    projection_weight: float  # 0.2, 1.0, 2.0
