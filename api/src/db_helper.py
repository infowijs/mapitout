import logging
import os

from sqlalchemy import create_engine
from sqlalchemy.engine.url import URL
from sqlalchemy.orm import sessionmaker
from sqlalchemy_utils.functions import (create_database, database_exists,
                                        drop_database)

from settings import ENVIRONMENT_OVERRIDES, config_auth

logging.basicConfig(level=logging.ERROR)
LOG = logging.getLogger(__name__)

Session = sessionmaker()

session = None


def make_conf(section):
    """Create database connection."""
    db = {
        'host': os.getenv("DATABASE_HOST"),
        'port':  os.getenv("DATABASE_PORT"),
        'database':  os.getenv("DATABASE_NAME"),
        'username':  os.getenv("DATABASE_USER"),
        'password':  os.getenv("DATABASE_PASSWORD"),
    }

    CONF = URL(
        drivername="postgresql",
        username=db['username'],
        password=db['password'],
        host=db['host'],
        port=db['port'],
        database=db['database'],
    )

    host, port, name = db['host'], db['port'], db['database']
    LOG.info(f"Database config {host}:{port}:{name}")
    return CONF


def create_db(section="test"):
    """Create the database."""
    CONF = make_conf(section)
    LOG.info(f"Created database")
    if not database_exists(CONF):
        create_database(CONF)


def drop_db(section="test"):
    """Cleanup test database."""
    LOG.info(f"Drop database")
    CONF = make_conf(section)
    if database_exists(CONF):
        drop_database(CONF)


def make_engine(section="docker"):
    CONF = make_conf(section)
    engine = create_engine(CONF)
    return engine


def set_session(engine):
    global session
    Session.configure(bind=engine)
    # create a configured "session" object for tests
    session = Session()
    return session
