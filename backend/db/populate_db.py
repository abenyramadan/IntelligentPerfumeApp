from db.core import get_session
from db.models import Perfume
from db.sample_data import sample_perfumes


def insert_perfumes():

    print("============================================")
    print("Populating perfume table")
    print("=============================================")

    with get_session() as session:
        perfumes = []
        for perfume in sample_perfumes:
            p = Perfume(**perfume)
            print(f"Created perfume with name: {p.name}")
            perfumes.append(p)
        session.add_all(perfumes)
        session.commit()


if __name__ == "main":
    insert_perfumes()
