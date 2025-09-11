from db.core import get_session
from db.models import Perfume
from schema.perfume_schema import PerfumeSchema
from schema.response_schema import APIResponse


class PerfumeService:
    @classmethod
    def create_perfume(cls, perfume: PerfumeSchema) -> APIResponse:
        """
        Takes perfume of type PerfumeSchema and save it to db
        """

        with get_session() as session:
            try:

                perfume_item = Perfume(**perfume.dict())
                session.add(perfume_item)
                session.commit()
                session.refresh(perfume_item)
                return APIResponse(
                    success=True, message=f"Created perfume successfully"
                )
            except:
                return APIResponse(
                    status_code=500, success=False, message="Failed to create perfume"
                )

    @classmethod
    def update_perfume(cls, perfume_id: int, perfume: PerfumeSchema) -> APIResponse:
        """
        Updates perfume with given id
        """

        with get_session() as session:
            perfume_to_update = session.query(Perfume).filter_by(id=perfume_id).first()

            if not perfume_to_update:
                return APIResponse(
                    status_code=404,
                    success=False,
                    message=f"Cannot find perfume with id: {perfume_id}",
                )

            else:
                perfume_to_update.name = perfume.name
                perfume_to_update.brand = perfume.brand
                perfume_to_update.concentration = perfume.concentration
                perfume_to_update.price = perfume.price
                perfume_to_update.fragrance_family = perfume.fragrance_family
                perfume_to_update.gender_presentation = perfume.gender_presentation
                perfume_to_update.projection = perfume.projection
                perfume_to_update.sillage = perfume.silage
                perfume_to_update.top_notes = perfume.top_notes
                perfume_to_update.middle_notes = perfume.middle_notes
                perfume_to_update.base_notes = perfume.base_nodes
                perfume_to_update.seasonal_focus = perfume.seasonal_focus
                perfume_to_update.allergens = perfume.allergens
                perfume_to_update.image_url = perfume.image_url
                perfume_to_update.intensity = perfume.intensity
                perfume_to_update.longevity_hours = perfume.longevity_hours

                session.add(perfume_to_update)
                session.commit()

                return APIResponse(
                    success=True,
                    message=f"Perfume with id {perfume_id} updated successfully",
                )

    @classmethod
    def delete_perfume(cls, perfume_id: int) -> APIResponse:
        """
        Delete perfume with given id
        """

        with get_session() as session:
            perfume_to_delete = session.query(Perfume).filter_by(id=perfume_id).first()

            if not perfume_to_delete:
                return APIResponse(
                    status_code=404,
                    success=False,
                    message=f"Cannot find perfume with id: {perfume_id}",
                )
            else:

                try:

                    session.delete(perfume_to_delete)
                    session.commit()
                    return APIResponse(
                        success=True,
                        message=f"Perfume with id: {perfume_id} deleted successfully",
                    )
                except:
                    return APIResponse(
                        status_code=500,
                        success=False,
                        message=f"Failed to delete perfume with id: {perfume_id}",
                    )

    @classmethod
    def get_perfume_by_id(cls, perfume_id: int) -> APIResponse:
        """
        Fetch perfume with given id
        """

        with get_session() as session:
            perfume = session.query(Perfume).filter_by(id=perfume_id).first()

            if not perfume:
                return APIResponse(
                    status_code=404,
                    success=False,
                    message=f"Cannot find perfume with id: {perfume_id}",
                )
            return APIResponse(success=True, message="Found perfume", data=[perfume])

    @classmethod
    def get_perfume_all(cls) -> APIResponse:
        """
        Read all perfumes
        """
        with get_session() as session:

            perfumes = session.query(Perfume).all()
            return APIResponse(success=True, message="All good", data=perfumes)
