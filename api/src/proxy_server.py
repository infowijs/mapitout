import requests
import logging
import db_helper
from flask import jsonify, Flask, request
from flask_cors import CORS
from os import environ
from poi_server import handle_poi_request


class InvalidUsage(Exception):
    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['message'] = self.message
        return rv


app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.DEBUG, format='%(message)s')
log = logging.getLogger(__name__)
log.setLevel(logging.ERROR)

PREFIX = '/api'

auth_headers = {
        'X-Application-Id': environ.get('APP_ID', 'test'),
        'X-Api-Key': environ.get('APP_KEY', 'test'),
        'Accept': 'application/json',
        'Content-type': 'application/json'
    }

engine = db_helper.make_engine(section="docker")
session = db_helper.set_session(engine)


def proxy_to_source(url):
    url = f'https://api.traveltimeapp.com/{url}'
    return url


@app.route(f'{PREFIX}/')
def root():
    return '.'


@app.route(f'{PREFIX}/metrics',  methods=['GET', 'POST'])
def metrics():
    return 'Alive'


@app.errorhandler(InvalidUsage)
def handle_invalid_usage(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response


@app.route(f'{PREFIX}/PoiApi/<path:url>', methods=['GET', 'POST'])
def poi(url):
    try:
        if not request.is_json:
            return 'invalid request'
        return handle_poi_request(url, request)
    except Exception as e:
        log.error(e)
        raise InvalidUsage("Bad request", status_code=400)


@app.route(f'{PREFIX}/TravelTimeApi/<path:url>', methods=['GET', 'POST'])
def proxy(url):
    try:
        url = proxy_to_source(url)
        method = requests.post if request.method == 'POST' else requests.get
        resp = method(
            url,
            stream=True,
            data=request.data,
            params=request.args,
            headers=auth_headers
        )
        return resp.content
    except Exception as e:
        log.error(e)
