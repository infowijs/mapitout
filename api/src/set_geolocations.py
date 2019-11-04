import db_helper
import logging
import requests
from models import Poi


logging.basicConfig(level=logging.DEBUG, format='%(message)s')
log = logging.getLogger(__name__)
log.setLevel(logging.ERROR)


def get_geo_openstreet(street, postalcode, city):
    BASE_URL = 'https://nominatim.openstreetmap.org/search/'
    URL_POSTFIX = '?format=json&addressdetails=1&limit=1'
    try:
        qry = f'{street} {city}'
        response = requests.get(BASE_URL + qry + URL_POSTFIX)
        data = response.json()
        if not data:
            log.error(f'Could not find geo for {qry}')
        else:
            return (float(data[0]['lon']), float(data[0]['lat']))
    except Exception as e:
        log.error(e)


def get_geo_gmaps(street, postalcode, city):
    BASE_URL = 'https://maps.googleapis.com/maps/api/geocode/json?address='
    KEY = '&key='
    try:
        # qry = f'{street}, {postalcode}, {city}'
        qry = f'{street}, {city}'
        response = requests.get(BASE_URL + qry + KEY)
        data = response.json()
        if not data:
            log.error(f'Could not find geo for {qry}')
        else:
            # print(data)
            geo = data['results'][0]['geometry']['location']
            return (geo['lng'], geo['lat'])
    except Exception as e:
        log.error(f'{e} - {qry}')
        return None


def main():
    engine = db_helper.make_engine(section="docker")
    session = db_helper.set_session(engine)
    for row in session.query(Poi).filter(Poi.geo_location == None):
        log.info(f'Processing {row.street} {row.postalcode} {row.city}')
        ret = get_geo_openstreet(row.street, row.postalcode, row.city)
        if ret:
            row.geo_location = f'SRID=4326;POINT({ret[0]:.8f} {ret[1]:.8f})'
            session.flush()
            session.commit()


if __name__ == "__main__":
    main()
