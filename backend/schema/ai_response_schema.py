from pydantic import BaseModel


class AIResponseSchema(BaseModel):
    perfume: str  # the recommended perfume
    reason: str  # major reason why above perfume is recommended
    other_perfumes_to_try: list[str]  # other suitable perfumes

    predicted_longevity: float | None = None  # perfume longevity in hours
    predicted_projection: float | None = None  # scale 1-10
    predicted_sillage: float | None = None  # 1-10
    predicted_pleasantness: float | None = None  # 1-10
    utility_score: float | None = None
