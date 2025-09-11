from pydantic import BaseModel


class APIResponse:
    def __init__(
        self,
        status_code: int = 200,
        success: bool = False,
        message: str = "",
        data: list = [],
    ):
        self.success = success
        self.message = message
        self.data = data

    def to_dict(self):
        return {"success": self.success, "message": self.message, "data": self.data}
