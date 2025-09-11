from db.core import get_session
from db.models import Log
from schema.log_schema import LogSchema
from schema.response_schema import APIResponse


class LogService:
    @classmethod
    def create_log(cls, _log: LogSchema) -> APIResponse:
        with get_session() as session:

            try:

                log_item = Log(**_log.dict())
                session.add(log_item)
                session.commit()
                return APIResponse(success=True, message="created log successfully")
            except:
                return APIResponse(
                    success=False, status_code=500, message="Failed to create log"
                )

    @classmethod
    def update_log(cls, log_id: int, log: LogSchema) -> APIResponse:
        with get_session() as session:
            db_log = session.query(Log).filter_by(id=log_id).first()

            if not log_id:
                return APIResponse(
                    status_code=404,
                    success=False,
                    message=f"Cannot find log with id: {log_id}",
                )
            else:
                db_log.operation_type = log.operation_type
                db_log.description = log.description
                db_log.url = log.url
                db_log.user_id = log.user_id

                return APIResponse(success=True, message="Log updated successfully")

    @classmethod
    def delete_log(cls, log_id: int) -> APIResponse:
        with get_session() as session:

            db_log = session.query(Log).filter_by(id=log_id).first()

            if not db_log:
                return APIResponse(
                    status_code=404,
                    success=False,
                    message=f"Cannot find log with id: {log_id}",
                )

            else:
                try:
                    session.delete(db_log)
                    session.commit()
                    return APIResponse(
                        status_code=200, success=True, message="Log deleted succesfully"
                    )
                except:
                    return APIResponse(
                        status_code=500, success=False, message="Failed to delete log"
                    )

    @classmethod
    def get_log_by_id(cls, log_id: int) -> APIResponse:
        with get_session() as session:
            db_log = session.query(Log).filter_by(id=log_id).first()

            if not db_log:
                return APIResponse(
                    status_code=404,
                    success=False,
                    message=f"Cannot find log with id: {log_id}",
                )

            else:
                return APIResponse(success=True, message="Found log", data=[db_log])

    @classmethod
    def get_logs_all(cls) -> APIResponse:
        with get_session() as session:
            db_logs = session.query(Log).all()

            if not db_logs:
                db_logs = []

            return APIResponse(success=True, message="All good", data=db_logs)
