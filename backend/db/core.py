"""
file name:  db core
description: contains code for initializing db connection, db session
author: Awet Thon
date : 09-09-2025
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session
import os
from dotenv import load_dotenv

from fastapi import Depends
from contextlib import contextmanager
from typing import Generator


load_dotenv()


DB_PATH = os.environ["DB_URL"]


db_engine = create_engine(DB_PATH)


SessionLocal = sessionmaker(bind=db_engine, autoflush=False, autocommit=False)

Base = declarative_base()


@contextmanager
def get_session() -> Generator[Session, None, None]:
    """session context
    this will allow us to use with sttement
    to execute queries and have session automatically closed
    """
    try:
        session = SessionLocal()
        yield session
    except Exception as e:
        print("Session rollback because of exception:{}", e)
        raise
    finally:
        session.close()
