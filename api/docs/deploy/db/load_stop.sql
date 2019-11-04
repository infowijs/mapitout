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

\COPY csv_stop_type_tmp FROM '/path/stops_out.csv' delimiter ',' csv header;

insert into csv_stop_type
select * from csv_stop_type_tmp
ON CONFLICT DO NOTHING