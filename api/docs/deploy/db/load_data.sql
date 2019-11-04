
INSERT INTO poi_type(id, name) values (1, 'Station');
ALTER SEQUENCE poi_type_id_seq RESTART WITH 1;


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

\COPY csv_stops FROM '/home/cuong/Projects/tmp/stops.txt' delimiter ',' csv header;
ANALYZE VERBOSE csv_stops;


BEGIN;
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
COMMIT;


INSERT INTO poi_type(id, name) values (2, 'School');
ALTER SEQUENCE poi_type_id_seq RESTART WITH 2;

INSERT INTO poi_property(id, name) values (1, 'Age range 4-11');
INSERT INTO poi_property(id, name) values (2, 'Age range 4-18');
ALTER SEQUENCE poi_property_id_seq RESTART WITH 2;


INSERT INTO poi (name,  street, postalcode, city, website, description, poi_type_id) values ('Amsterdam International Community School (AICS)','Prinses Irenestraat 59','1077 WV','Amsterdam','www.aics.espritscholen.nl','The Amsterdam International Community School (ages: 3 to 18) is a partially-subsidised school offering the IB curriculum.', 2);INSERT INTO poi_property_relation(poi_id, prop_id) values(currval('poi_id_seq'), 1);
INSERT INTO poi (name,  street, postalcode, city, website, description, poi_type_id) values ('Amsterdam International Community School (AICS) South East','Darlingstraat 2','1102 MX','Amsterdam (South-East)','www.aics.espritscholen.nl','The Amsterdam International Community School (ages: 3 to 18) is a partially-subsidised school offering the IB curriculum.', 2);INSERT INTO poi_property_relation(poi_id, prop_id) values(currval('poi_id_seq'), 1);
INSERT INTO poi (name,  street, postalcode, city, website, description, poi_type_id) values ('Amsterdam International Community School (AICS) Satellite','Arent Janszoon Ernststraat 130','1082 LP','Amsterdam','www.aics.espritscholen.nl','The Amsterdam International Community School (ages: 3 to 18) is a partially-subsidised school offering the IB curriculum.', 2);INSERT INTO poi_property_relation(poi_id, prop_id) values(currval('poi_id_seq'), 1);
INSERT INTO poi (name,  street, postalcode, city, website, description, poi_type_id) values ('British School of Amsterdam (BSA)','Jan van Eijckstraat 21','1077 LG','Amsterdam','www.britams.nl','The British School of Amsterdam (ages 3 to 18) offered the British curriculum and an extensive extra-curricular programme, and offers students the opportunity to learn two additional languages.', 2);INSERT INTO poi_property_relation(poi_id, prop_id) values(currval('poi_id_seq'), 1);
INSERT INTO poi (name,  street, postalcode, city, website, description, poi_type_id) values ('International School of Amsterdam (ISA)','Sportlaan 45','1185 TB','Amstelveen','www.isa.nl','The International School of Amsterdam (ages 2 to 18) is an IB World school offering the full IB programme and an extensive extra-curricular schedule.', 2);INSERT INTO poi_property_relation(poi_id, prop_id) values(currval('poi_id_seq'), 1);
INSERT INTO poi (name,  street, postalcode, city, website, description, poi_type_id) values ('Florencius International School Amstelveen','De Savornin Lohmanlaan 2','1181 XM','Amstelveen','florenciusinternationalschool.nl/','Florencius International School (ages 4 to 12) offers the IP curriculum and focuses on UK literacy and numeracy teaching strategies. Florencius works in small groups (1 professional with 8 children at most).', 2);INSERT INTO poi_property_relation(poi_id, prop_id) values(currval('poi_id_seq'), 1);
INSERT INTO poi (name,  street, postalcode, city, website, description, poi_type_id) values ('Florencius International School Laren','Leemzeulder 29','1251 AM','Laren','florenciusinternationalschool.nl/','Florencius International School (ages 4 to 12) offers the IP curriculum and focuses on UK literacy and numeracy teaching strategies. Florencius works in small groups (1 professional with 8 children at most).', 2);INSERT INTO poi_property_relation(poi_id, prop_id) values(currval('poi_id_seq'), 1);
INSERT INTO poi (name,  street, postalcode, city, website, description, poi_type_id) values ('Florencius International School Haarlem','Florapark 1','2012 HK','Haarlem','florenciusinternationalschool.nl/','Florencius International School (ages 4 to 12) offers the IP curriculum and focuses on UK literacy and numeracy teaching strategies. Florencius works in small groups (1 professional with 8 children at most).', 2);INSERT INTO poi_property_relation(poi_id, prop_id) values(currval('poi_id_seq'), 1);
INSERT INTO poi (name,  street, postalcode, city, website, description, poi_type_id) values ('International School Haarlem','Schreveliusstraat 2','2014 XP','Haarlem','www.internationalschoolhaarlem.nl','The International School Haarlem (ages 4 to 15) is a partially-subsidised, Dutch International School offering a combination of the IPC and British national curricula.', 2);INSERT INTO poi_property_relation(poi_id, prop_id) values(currval('poi_id_seq'), 1);
INSERT INTO poi (name,  street, postalcode, city, website, description, poi_type_id) values ('Optimist International School','Deltaweg 109','2134 XS','Hoofddorp','www.optimist-international-school.nl/','The Optimist International School (ages 4 to 12) offers the IP curriculum and uses the British national curriculum to teach literacy and numeracy.', 2);INSERT INTO poi_property_relation(poi_id, prop_id) values(currval('poi_id_seq'), 1);
INSERT INTO poi (name,  street, postalcode, city, website, description, poi_type_id) values ('Gifted Minds International School','Oppaallaan 1190-1196','2132 LN','Hoofddorp','http://giftedmindsinternationalschool.com/','The Gifted Minds International School (ages 3 to 12) offers the IB Primary curriculum with American Common Core State standards.', 2);INSERT INTO poi_property_relation(poi_id, prop_id) values(currval('poi_id_seq'), 1);
INSERT INTO poi (name,  street, postalcode, city, website, description, poi_type_id) values ('IPS Hilversum, Violenschool','Rembrandtlaan 30','1213 BH','Hilversum','www.ipshilversum.nl','The International Primary School Hilversum (ages 4 to 12) is a partially-subsidised Dutch International School offering the IB curriculum.', 2);INSERT INTO poi_property_relation(poi_id, prop_id) values(currval('poi_id_seq'), 1);
INSERT INTO poi (name,  street, postalcode, city, website, description, poi_type_id) values ('International School Hilversum  (ISH)','Emmastraat 56','1213 AL','Hilversum','www.ishilversum.nl','The International School Hilversum, Alberdingk Thijm, (ages 4 to 18) is an IB World school offering the IB Primary, Middle Years and Diploma curricula. It has a notable library and an extensive extra-curricular programme.', 2);INSERT INTO poi_property_relation(poi_id, prop_id) values(currval('poi_id_seq'), 1);
INSERT INTO poi (name,  street, postalcode, city, website, description, poi_type_id) values ('International School Utrecht (ISU)','Van Bijnkershoeklaan 8','3527 XL','Utrecht','www.isutrecht.nl','The International School Utrecht (ages 2 to 18) is a Dutch International and IB World school offering the full IB programme.', 2);INSERT INTO poi_property_relation(poi_id, prop_id) values(currval('poi_id_seq'), 1);
INSERT INTO poi (name,  street, postalcode, city, website, description, poi_type_id) values ('International Primary School Almere','A. Roland Holststraat 58','1321 RX','Almere','www.ipsalmere.nl','The International Primary School Almere (ages 2 to 11) offers the IP curriculum and extra-curricular activities via the Brede School.', 2);INSERT INTO poi_property_relation(poi_id, prop_id) values(currval('poi_id_seq'), 1);
INSERT INTO poi (name,  street, postalcode, city, website, description, poi_type_id) values ('European School Bergen  (ESB)','Molenweidtje 5','1862 BC','Bergen','www.esbergen.eu','The European School Bergen (ages 4 to 18) is a European school offering the European Baccalaureate programme.', 2);INSERT INTO poi_property_relation(poi_id, prop_id) values(currval('poi_id_seq'), 1);
INSERT INTO poi (name,  street, postalcode, city, website, description, poi_type_id) values ('Elckerlyc International School','Klimopzoom 41','2353 RE','Leiderdorp','www.elckerlyc-international.nl','The Elckerlyc International School (ages 3 to 12) is a Montessori school offering the IPS curriculum.', 2);INSERT INTO poi_property_relation(poi_id, prop_id) values(currval('poi_id_seq'), 1);
INSERT INTO poi (name,  street, postalcode, city, website, description, poi_type_id) values ('The British School in The Netherlands  (BSN)','Vrouw Avenweg 640','2493 WZ','The Hague','www.britishschool.nl','The British School in The Netherlands (ages 3 to 18) is a results-focused school with the choice of either the IB programme or British A Levels.', 2);INSERT INTO poi_property_relation(poi_id, prop_id) values(currval('poi_id_seq'), 1);
INSERT INTO poi (name,  street, postalcode, city, website, description, poi_type_id) values ('The American School of The Hague  (ASH)','Rijksstraatweg 200 ','2241 BX','Wassenaar','www.ash.nl','The American School of the Hague (ages 0 to 18) offers an American-accredited curriculum, and a strong extra-curricular programme covering music, athletics and the Hague Model UN.', 2);INSERT INTO poi_property_relation(poi_id, prop_id) values(currval('poi_id_seq'), 1);
INSERT INTO poi (name,  street, postalcode, city, website, description, poi_type_id) values ('European School The Hague','Houtrustweg 2','2566 HA','The Hague','www.eshthehague.nl','The European School the Hague (ages 4 to 18) is a European school offering the European Baccalaureate programme.', 2);INSERT INTO poi_property_relation(poi_id, prop_id) values(currval('poi_id_seq'), 1);
INSERT INTO poi (name,  street, postalcode, city, website, description, poi_type_id) values ('Primary School Haagsche Schoolvereeniging (HSV)','Van Nijenrodestraat 16','2597 RM','The Hague','www.hsvdenhaag.nl','The HSV International Primary School operates from four locations in The Hague and educates more than 500 pupils from over 50 countries. The school is subsidised by the Netherlands Ministry of Education, making the school affordable for the international community.', 2);INSERT INTO poi_property_relation(poi_id, prop_id) values(currval('poi_id_seq'), 1);
INSERT INTO poi (name,  street, postalcode, city, website, description, poi_type_id) values ('Primary School Haagsche Schoolvereeniging (HSV)','Nassaulaan 26','2514 JT','The Hague','www.hsvdenhaag.nl','The HSV International Primary School operates from four locations in The Hague and educates more than 500 pupils from over 50 countries. The school is subsidised by the Netherlands Ministry of Education, making the school affordable for the international community.', 2);INSERT INTO poi_property_relation(poi_id, prop_id) values(currval('poi_id_seq'), 1);
INSERT INTO poi (name,  street, postalcode, city, website, description, poi_type_id) values ('Primary School Haagsche Schoolvereeniging (HSV)','Van Heutszstraat 12','2593 PJ','The Hague','www.hsvdenhaag.nl','The HSV International Primary School operates from four locations in The Hague and educates more than 500 pupils from over 50 countries. The school is subsidised by the Netherlands Ministry of Education, making the school affordable for the international community.', 2);INSERT INTO poi_property_relation(poi_id, prop_id) values(currval('poi_id_seq'), 1);
INSERT INTO poi (name,  street, postalcode, city, website, description, poi_type_id) values ('Primary School Haagsche Schoolvereeniging (HSV)','Kon. Sophiestraat 24A','2595 TG','The Hague','www.hsvdenhaag.nl','The HSV International Primary School operates from four locations in The Hague and educates more than 500 pupils from over 50 countries. The school is subsidised by the Netherlands Ministry of Education, making the school affordable for the international community.', 2);INSERT INTO poi_property_relation(poi_id, prop_id) values(currval('poi_id_seq'), 1);
INSERT INTO poi (name,  street, postalcode, city, website, description, poi_type_id) values ('The International School of The Hague  (ISH)','Wijndaelerduin 1','2554 BX ','The Hague','www.ishthehague.nl','The International School the Hague (ages 4 to 18) is a modern school offering the IP and IB Middle Years programmes, as well as an extensive extra-curricular schedule with a great focus on music.', 2);INSERT INTO poi_property_relation(poi_id, prop_id) values(currval('poi_id_seq'), 1);
INSERT INTO poi (name,  street, postalcode, city, website, description, poi_type_id) values ('The International Waldorf School The Hague ','2e Messstraat 31','2586 XA','The Hague','https://internationalwaldorfschool.nl/','The International Waldorf School The Hague offers international primary school education for children aged 4-8. The school is funded by the Ministry of Education in the Netherlands', 2);INSERT INTO poi_property_relation(poi_id, prop_id) values(currval('poi_id_seq'), 1);
INSERT INTO poi (name,  street, postalcode, city, website, description, poi_type_id) values ('International School Delft  (ISD)','Jaffalaan 9','2628 BX','Delft','www.isdelft.nl','The International School Delft (ages 0 to 12) offers the IB Primary Years programme and is currently pursuing IB World School status.', 2);INSERT INTO poi_property_relation(poi_id, prop_id) values(currval('poi_id_seq'), 1);
INSERT INTO poi (name,  street, postalcode, city, website, description, poi_type_id) values ('American International School of Rotterdam  (AISR)','Verhulstlaan 21','3055 WJ','Rotterdam','www.aisr.nl','The American International School of Rotterdam (ages 3 to 18) offers the International Primary, International Middle Years and the IB Diploma programmes, among others.', 2);INSERT INTO poi_property_relation(poi_id, prop_id) values(currval('poi_id_seq'), 1);
INSERT INTO poi (name,  street, postalcode, city, website, description, poi_type_id) values ('De Blijberg, International Primary School','Graaf Florisstraat 56','3021 CJ','Rotterdam','http://international.blijberg.nl','The Rotterdam International Primary School, De Blijberg (ages 4 to 12) offers the International Primary Curriculum.', 2);INSERT INTO poi_property_relation(poi_id, prop_id) values(currval('poi_id_seq'), 1);


INSERT INTO poi (name,  street, postalcode, city, website, description, poi_type_id) values ('Amsterdam International Community School (AICS)','Prinses Irenestraat 59','1077 WV','Amsterdam','www.aics.espritscholen.nl','The Amsterdam International Community School (ages: 3 to 18) is a partially-subsidised school offering the IB curriculum.', 2);INSERT INTO poi_property_relation(poi_id, prop_id) values(currval('poi_id_seq'), 2);
INSERT INTO poi (name,  street, postalcode, city, website, description, poi_type_id) values ('Amsterdam International Community School (AICS) South East location','Darlingstraat 2','1102 MX','Amsterdam (South-East)','www.aics.espritscholen.nl','The Amsterdam International Community School (ages: 3 to 18) is a partially-subsidised school offering the IB curriculum.', 2);INSERT INTO poi_property_relation(poi_id, prop_id) values(currval('poi_id_seq'), 2);
INSERT INTO poi (name,  street, postalcode, city, website, description, poi_type_id) values ('British School of Amsterdam (BSA)','Fred. Roeskestraat 94a','1076 ED','Amsterdam','www.britams.nl','The British School of Amsterdam (ages 3 to 18) offered the British curriculum and an extensive extra-curricular programme, and offers students the opportunity to learn two additional languages.', 2);INSERT INTO poi_property_relation(poi_id, prop_id) values(currval('poi_id_seq'), 2);
INSERT INTO poi (name,  street, postalcode, city, website, description, poi_type_id) values ('International School of Amsterdam (ISA)','Sportlaan 45','1185 TB','Amstelveen','www.isa.nl','The International School of Amsterdam (ages 2 to 18) is an IB World school offering the full IB programme and an extensive extra-curricular schedule.', 2);INSERT INTO poi_property_relation(poi_id, prop_id) values(currval('poi_id_seq'), 2);
INSERT INTO poi (name,  street, postalcode, city, website, description, poi_type_id) values ('International School Haarlem','Oorkondelaan 65','2033 MN','Haarlem','www.internationalschoolhaarlem.nl','The International School Haarlem (ages 4 to 15) is a partially-subsidised, Dutch International School offering a combination of the IPC and British national curricula.', 2);INSERT INTO poi_property_relation(poi_id, prop_id) values(currval('poi_id_seq'), 2);
INSERT INTO poi (name,  street, postalcode, city, website, description, poi_type_id) values ('International School Hilversum  (ISH)','Emmastraat 56','1213 AL','Hilversum','www.ishilversum.nl','The International School Hilversum, Alberdingk Thijm, (ages 4 to 18) is an IB World school offering the IB Primary, Middle Years and Diploma curricula. It has a notable library and an extensive extra-curricular programme.', 2);INSERT INTO poi_property_relation(poi_id, prop_id) values(currval('poi_id_seq'), 2);
INSERT INTO poi (name,  street, postalcode, city, website, description, poi_type_id) values ('International School Utrecht (ISU)','Van Bijnkershoeklaan 8','3527 XL','Utrecht','www.isutrecht.nl','The International School Utrecht (ages 2 to 18) is a Dutch International and IB World school offering the full IB programme.', 2);INSERT INTO poi_property_relation(poi_id, prop_id) values(currval('poi_id_seq'), 2);
INSERT INTO poi (name,  street, postalcode, city, website, description, poi_type_id) values ('International School Almere','Heliumweg 61','1362 JA','Almere','www.internationalschoolalmere.nl','The International School Almere (ages 11 to 18) offers the IB Middle Years and Diploma programmes.', 2);INSERT INTO poi_property_relation(poi_id, prop_id) values(currval('poi_id_seq'), 2);
INSERT INTO poi (name,  street, postalcode, city, website, description, poi_type_id) values ('European School Bergen  (ESB)','Molenweidtje 5','1862 BC','Bergen','www.esbergen.eu','The European School Bergen (ages 4 to 18) is a European school offering the European Baccalaureate programme.', 2);INSERT INTO poi_property_relation(poi_id, prop_id) values(currval('poi_id_seq'), 2);
INSERT INTO poi (name,  street, postalcode, city, website, description, poi_type_id) values ('Het Rijnlands Lyceum Oegstgeest International School','Apollolaan 1','2341 BA','Oegstgeest','www.isrlo.nl','The International School Rijnlands Lyceum Oegstgeest (ages 12 to 18) offers an accredited Dutch programme as well as the IB Middle Years and Diploma curricula.', 2);INSERT INTO poi_property_relation(poi_id, prop_id) values(currval('poi_id_seq'), 2);
INSERT INTO poi (name,  street, postalcode, city, website, description, poi_type_id) values ('The British School in The Netherlands  (BSN)','Vrouw Avenweg 640','2493 WZ','The Hague','www.britishschool.nl','The British School in The Netherlands (ages 3 to 18) is a results-focused school with the choice of either the IB programme or British A Levels.', 2);INSERT INTO poi_property_relation(poi_id, prop_id) values(currval('poi_id_seq'), 2);
INSERT INTO poi (name,  street, postalcode, city, website, description, poi_type_id) values ('The American School of The Hague  (ASH)','Rijksstraatweg 200 ','2241 BX','Wassenaar','www.ash.nl','The American School of the Hague (ages 0 to 18) offers an American-accredited curriculum, and a strong extra-curricular programme covering music, athletics and the Hague Model UN.', 2);INSERT INTO poi_property_relation(poi_id, prop_id) values(currval('poi_id_seq'), 2);
INSERT INTO poi (name,  street, postalcode, city, website, description, poi_type_id) values ('European School The Hague','Houtrustweg 2','2566 HA','The Hague','www.eshthehague.nl','The European School the Hague (ages 4 to 18) is a European school offering the European Baccalaureate programme.', 2);INSERT INTO poi_property_relation(poi_id, prop_id) values(currval('poi_id_seq'), 2);
INSERT INTO poi (name,  street, postalcode, city, website, description, poi_type_id) values ('The International School of The Hague  (ISH)','Wijndaelerduin 1','2554 BX ','The Hague','www.ishthehague.nl','The International School the Hague (ages 4 to 18) is a modern school offering the IP and IB Middle Years programmes, as well as an extensive extra-curricular schedule with a great focus on music.', 2);INSERT INTO poi_property_relation(poi_id, prop_id) values(currval('poi_id_seq'), 2);
INSERT INTO poi (name,  street, postalcode, city, website, description, poi_type_id) values ('American International School of Rotterdam  (AISR)','Verhulstlaan 21','3055 WJ','Rotterdam','www.aisr.nl','The American International School of Rotterdam (ages 3 to 18) offers the International Primary, International Middle Years and the IB Diploma programmes, among others.', 2);INSERT INTO poi_property_relation(poi_id, prop_id) values(currval('poi_id_seq'), 2);


INSERT INTO poi_property(id, name) values (3, 'Primary education');
INSERT INTO poi_property(id, name) values (4, 'Secondary education');
ALTER SEQUENCE poi_property_id_seq RESTART WITH 4;


INSERT INTO poi_property(id, name) values (5, 'railStation');
INSERT INTO poi_property(id, name) values (6, 'combiTramBus');
INSERT INTO poi_property(id, name) values (7, 'ferryPort');
INSERT INTO poi_property(id, name) values (8, 'metroStation');
INSERT INTO poi_property(id, name) values (9, 'combiMetroTram');
INSERT INTO poi_property(id, name) values (10, 'onstreetTram');
INSERT INTO poi_property(id, name) values (11, 'busStation');
INSERT INTO poi_property(id, name) values (12, 'tramStation');
INSERT INTO poi_property(id, name) values (13, 'other');
INSERT INTO poi_property(id, name) values (14, 'onstreetBus');
ALTER SEQUENCE poi_property_id_seq RESTART WITH 14;

INSERT INTO poi_property_relation(poi_id, prop_id) 
select p.id, prop.id
from poi p, csv_stop_type t, poi_property prop
where p.poi_type_id = 1 and p.name = t.stop_code
and prop.name = t.stop_type;
commit;

