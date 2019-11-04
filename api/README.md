<p align="center">
  <br /><br />
  <img src="docs/logo.svg" />
  <br /><br />
</p>


## Introduction
This service provides back-end APIs for the [MapItOut tool](https://mapitout.iamsterdam.com/).


## Deployment

Required environment variables:
```
APP_ID : travel time api id
APP_KEY : travel time api key
```


## Local development

Install requirements:

```
virtualenv --python=$(which python3) venv
source venv/bin/activate
pip install -r requirements.txt
```

Run flask app:

```
export APP_ID=<id>
export APP_KEY=<key>
export FLASK_APP=proxy_server.py
flask run
```


## Data model
```
     +--------------------------+                            
     |                          |                            
     |  Poi_property_relation   |                            
     |                          |                            
     +------|------------|------+                            
            |            |                                   
            |            |                                   
+-----------|---+    +---|-----------+       +--------------+
|               |    |               |       |              |
|  Poi_property |    |      Poi      ---------   Poi_type   |
|               |    |               |       |              |
+---------------+    +---------------+       +--------------+
```

### Static data
```
poi_type:
 id |  name   | description 
----+---------+-------------
  1 | Station | 
  2 | School  | 

poi_property:
 id |         name          | description 
----+-----------------------+-------------
  1 | Age range 4-11        | 
  2 | Age range 4-18        | 
  3 | Primary education     | 
  4 | Secondary education   | 
  5 | International schools | 
  6 | Dutch schools         | 
  7 | ferryPort             | 
  8 | metroStation          | 
  9 | combiMetroTram        | 
 10 | onstreetTram          | 
 11 | busStation            | 
 12 | tramStation           | 
 13 | other                 | 
 14 | onstreetBus           | 

```

### Populating stations

The raw station data is 'borrowed' from the external-data-scrapers project. The stops.txt
contains the raw stops. The raw data is loaded using the following commands:
```
DROP TABLE IF EXISTS csv_stops;
CREATE TABLE csv_stops (
    stop_id                 VARCHAR(255) NOT NULL,
    stop_code               VARCHAR(255),
    stop_name               VARCHAR(255),
    stop_lat                REAL NOT NULL,
    stop_lon                REAL NOT NULL,
    location_type           VARCHAR(255),
    parent_station          VARCHAR(255),
    stop_timezone           VARCHAR(255),
    wheelchair_boarding     SMALLINT,
    platform_code           VARCHAR(255),
    zone_id                 VARCHAR(255),
    CONSTRAINT csv_stops_pkey PRIMARY KEY(stop_id)
);

\COPY csv_stops FROM 'stops.txt' delimiter ',' csv header;
ANALYZE VERBOSE csv_stops;

INSERT INTO poi (name, description, geo_location, poi_type_id)
SELECT DISTINCT ON (stop_code)
    stop_code,
    stop_name,
    ST_SetSRID(ST_MakePoint(CAST(stop_lon AS FLOAT), CAST(stop_lat AS FLOAT)), 4326),
    1
FROM
    csv_stops
WHERE
    stop_code is not null;
```
The station type can be retrieved from http://data.ndovloket.nl/haltes/. The xml file
is converted to csv using [convert_stops.py](api/deploy/db/convert_stops.py)

```
DROP TABLE IF EXISTS csv_stop_type_tmp;
CREATE TABLE csv_stop_type_tmp (
    stop_code               VARCHAR(255),
    stop_type             VARCHAR(255)
);

DROP TABLE IF EXISTS csv_stops_type;
CREATE TABLE csv_stop_type (
    stop_code               VARCHAR(255),
    stop_type             VARCHAR(255),
    CONSTRAINT csv_stops_pkey PRIMARY KEY(stop_code, stop_type)
);

\COPY csv_stop_type_tmp FROM 'stops_out.csv' delimiter ',' csv header;

insert into csv_stop_type
select * from csv_stop_type_tmp
ON CONFLICT DO NOTHING
```

The types can now be used to set the type as poi property.

```
INSERT INTO poi_property_relation(poi_id, prop_id) 
select p.id, prop.id
from poi p, csv_stop_type t, poi_property prop
where p.poi_type_id = 1 and p.name = t.stop_code
and prop.name = t.stop_type;
```

### Populating schools

#### International schools
The international schools insert statements are located in
[load_data.sql](api/deploy/db/load_data.sql)

#### Dutch schools
The primary and seconday schools insert statements have been created from the .xls files available at https://duo.nl/open_onderwijsdata/databestanden/po/adressen/
[primary_school.sql](api/deploy/db/primary_school.sql)
[secondary_school.sql](api/deploy/db/secondary_school.sql)

### Make dump for deploy
[dump.sh](api/deploy/db/dump.sh) is used to create a [db.sql](api/deploy/db/db.sql) that will be loaded by the api.

### Populating new sources
* new poi_type (if needed)
* new poi_property (if needed)
* insert new poi's in poi table.
    * a geo_location should be set
    * a poi type should be set
* insert new poi_property_relation (if needed)

### API
See example json in [test_api.py](api/src/test_api.py)
