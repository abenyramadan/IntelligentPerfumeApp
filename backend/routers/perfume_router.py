from fastapi import APIRouter
from service.perfume_service import PerfumeService
from schema.perfume_schema import PerfumeSchema

router = APIRouter(prefix="/perfumes", tags=["Perfumes"])


@router.get("/")
def get_perfumes_all():
    return PerfumeService.get_perfume_all()


@router.post("/")
def create_perfume(perfume: PerfumeSchema):
    return PerfumeService.create_perfume(perfume)


@router.put("/{perfume_id}")
def update_perfume(perfume_id: int, perfume: dict):
    return PerfumeService.update_perfume(perfume_id, perfume)


@router.delete("/{perfume_id}")
def delete_perfume(perfume_id: int):
    return PerfumeService.delete_perfume(perfume_id)


@router.get("/{perfume_id}")
def get_perfume_by_id(perfume_id):
    return PerfumeService.get_perfume_by_id(perfume_id)
