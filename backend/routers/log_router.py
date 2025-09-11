from fastapi import APIRouter
from service.log_service import LogService
from schema.log_schema import LogSchema

router = APIRouter(prefix="/logs", tags=["System Logs"])


@router.get("/")
def get_logs_all():
    return LogService.get_logs_all()


@router.get("/{log_id}")
def get_log_by_id(log_id: int):
    return LogService.get_log_by_id(log_id)


@router.post("/")
def create_log(log: LogSchema):
    return LogService.create_log(log)


@router.put("/{log_id}")
def update_log(log_id: int, log: LogSchema):
    return LogService.update_log(log_id, log)


@router.delete("/{log_id}")
def delete_log(log_id: int):
    return LogService.delete_log(log_id)


# FOR GOD SAKE DON'T ATTEMPT THIS!!!!!!!!!!!

# @router.delete("/d/all")
# def delete_logs_all():
#     return LogService.delete_logs_all()
