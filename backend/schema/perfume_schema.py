from pydantic import BaseModel


class PerfumeSchema(BaseModel):
    name: str
    brand: str
    concentration: str
    price: float | None = None

    # fragrance xtics
    fragrance_family: str
    intensity: str
    longevity_hours: int
    projection: str
    sillage: str

    # note
    top_notes: str | None = None
    middle_notes: str | None = None
    base_notes: str | None = None

    # seasonal and gender
    seasonal_focus: str
    gender_presentation: str

    # ingredients that might cause allergies(comma seperated)
    allergens: str | None = None
    image_url: str | None = None
