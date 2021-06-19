interface POIDescription {
  city: string;
  description: string;
  geo_location: {
    type: string;
    coordinates: [number, number];
  };
  id: number;
  name: string;
  poi_type_id: number;
  postalcode: string;
  street: string;
  website: string;
}

type POIData = [POIDescription, [number, number]];

export type POIApiResponse = POIData[];
