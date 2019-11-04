import argparse
import asyncio
import logging
import db_helper

from geoalchemy2 import Geometry
from sqlalchemy import Column, Integer, String, ForeignKey
# from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.ext.declarative import declarative_base
# from sqlalchemy.schema import Sequence

# logging.basicConfig(level=logging.DEBUG)
LOG = logging.getLogger(__name__)
Base = declarative_base()
POI_TABLES = [
    "poi_type",
    "poi",
    "poi_property_relation",
    "poi_property"
]


def drop_tables(session):
    for table in POI_TABLES:
        session.execute(f"DROP table if exists {table} CASCADE;")
    session.commit()


async def main(args):
    """Main."""
    engine = db_helper.make_engine(section="docker")

    session = db_helper.set_session(engine)

    if args.drop:
        # resets everything
        LOG.warning("DROPPING ALL DEFINED TABLES")
        drop_tables(session)

    LOG.warning("CREATING DEFINED TABLES")
    # recreate tables
    Base.metadata.create_all(engine)


class PoiType(Base):
    """Poi data type"""
    __tablename__ = f"poi_type"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, nullable=True)


class Poi(Base):
    """Poi data"""
    __tablename__ = f"poi"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, nullable=True)
    street = Column(String(length=255), nullable=True)
    postalcode = Column(String(length=10), nullable=True)
    city = Column(String(length=255), nullable=True)
    website = Column(String(length=255), nullable=True)
    geo_location = Column(
        Geometry('POINT', srid=4326), index=True, nullable=True
    )
    poi_type_id = Column(Integer, ForeignKey('poi_type.id'))


class PoiProperty(Base):
    """Poi properties """
    __tablename__ = f"poi_property"

    id = Column(Integer, primary_key=True)
    name = Column(String, index=True)
    description = Column(String, nullable=True)


class PoiPropertyRelation(Base):
    """Poi properties relation mapping """
    __tablename__ = f"poi_property_relation"
    poi_id = Column(Integer, ForeignKey('poi.id'), primary_key=True)
    prop_id = Column(Integer, ForeignKey('poi_property.id'), primary_key=True)


if __name__ == "__main__":
    desc = "Create/Drop defined model tables."
    inputparser = argparse.ArgumentParser(desc)

    inputparser.add_argument(
        "--drop", action="store_true", default=False, help="Drop existing"
    )

    args = inputparser.parse_args()
    loop = asyncio.get_event_loop()
    loop.run_until_complete(main(args))
