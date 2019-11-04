import configparser
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

config_auth = configparser.ConfigParser()
config_auth.read(os.path.join(BASE_DIR, "config.ini"))

TESTING = {"running": False}

ENVIRONMENT_OVERRIDES = [
    ('host', 'DATABASE_HOST'),
    ('port', 'DATABASE_PORT'),
    ('database', 'DATABASE_NAME'),
    ('username', 'DATABASE_USER'),
    ('password', 'DATABASE_PASSWORD'),
]

VERIFY_SSL = os.getenv('ADP_USE_SSL_CERT', False)
