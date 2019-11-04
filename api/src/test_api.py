import unittest
import logging
import db_helper

from unittest.mock import MagicMock
from models import Poi, PoiType, PoiProperty, PoiPropertyRelation
from models import Base, drop_tables
from poi_server import handle_poi_request

from flask import request
# from requests import Request

logging.basicConfig(level=logging.DEBUG)
log = logging.getLogger(__name__)


class TestApi(unittest.TestCase):
    engine = db_helper.make_engine(section="test")
    session = db_helper.set_session(engine)

    def make_pt(self, lon, lat):
        ret = 'SRID=4326;POINT(%0.8f %0.8f)' % (lon, lat)
        return ret

    def setUp(self):
        drop_tables(self.session)
        Base.metadata.create_all(self.engine)
        # dummy data
        self.session.add(PoiType(id=1, name='school'))
        self.session.commit()

        self.session.add(
            Poi(id=1, name='test poi',
                postalcode='123ab',
                street='street',
                city='amsterdam',
                geo_location=self.make_pt(-73.883573184, 40.751662187),
                poi_type_id=1
                )
        )
        self.session.commit()

        self.session.add(PoiProperty(id=1, name='basis school'))
        self.session.commit()
        self.session.add(PoiProperty(id=2, name='test prop'))
        self.session.commit()
        self.session.add(PoiPropertyRelation(poi_id=1, prop_id=1))
        self.session.commit()
        self.session.add(PoiPropertyRelation(poi_id=1, prop_id=2))
        self.session.commit()

    def tearDown(self):
        self.session.commit()
        Base.metadata.drop_all(self.engine)

    def test_poi_name(self):
        data = {"poi_by_name": "test poi"}
        req = MagicMock(spec=request)
        req.get_json = MagicMock(return_value=data)
        req.is_json = MagicMock(return_value=True)

        resp = handle_poi_request('', req)
        self.assertEqual(resp.json[0][0]['id'], 1)

    def test_poi_type(self):
        data = {"poi_by_type": ["school"]}
        req = MagicMock(spec=request)
        req.get_json = MagicMock(return_value=data)
        req.is_json = MagicMock(return_value=True)

        resp = handle_poi_request('', req)
        self.assertEqual(resp.json[0][0]['id'], 1)

    def test_poi_property(self):
        data = {
            "poi_by_property": ["basis school", "test prop"],
        }
        req = MagicMock(spec=request)
        req.get_json = MagicMock(return_value=data)
        req.is_json = MagicMock(return_value=True)

        resp = handle_poi_request('', req)
        self.assertEqual(resp.json[0][0]['id'], 1)

    def test_poi_name_and_type(self):
        data = {
            "poi_by_type": ["school"],
            "poi_by_name": "test poi"
        }
        req = MagicMock(spec=request)
        req.get_json = MagicMock(return_value=data)
        req.is_json = MagicMock(return_value=True)

        resp = handle_poi_request('', req)
        self.assertEqual(resp.json[0][0]['id'], 1)

    def test_poi_in_polygon(self):
        data = {
            "poi_in_polygon": {
                "type": "Feature",
                "properties": {
                    "name": "bla",
                    "area": 2947
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [-73.869424572841766, 40.74915687096788],
                            [-73.891431299772762, 40.74684466041932],
                            [-73.895071432408585, 40.746465470812154],
                            [-73.896187378678206, 40.748509425180877],
                            [-73.895839541851402, 40.74854687570604],
                            [-73.895252427743969, 40.748306609450246],
                            [-73.896540410855621, 40.750541998143589],
                            [-73.895798686138292, 40.750619721332619],
                            [-73.896522306614344, 40.754388796109033],
                            [-73.881648121884808, 40.755951617041873],
                            [-73.872218558824784, 40.756943248067479],
                            [-73.871679923567925, 40.753987174396038],
                            [-73.872070465138904, 40.753862007052064],
                            [-73.869424572841766, 40.74915687096788]
                            # [35, 10], [45, 45], [15, 40], [10, 20], [35, 10]
                        ]
                    ],
                    "crs": {
                        "type": "name",
                        "properties": {
                            "name": "EPSG:4326"
                        }
                    }
                },
            }
        }
        req = MagicMock(spec=request)
        req.get_json = MagicMock(return_value=data)
        req.is_json = MagicMock(return_value=True)

        resp = handle_poi_request('', req)
        self.assertEqual(resp.json[0][0]['id'], 1)
