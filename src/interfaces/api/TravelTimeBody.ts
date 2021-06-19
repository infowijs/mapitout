import { TransportType } from "../../enums";

interface DepartureSearch {
  id: string;
  coords: {
    lat: number;
    lng: number;
  };
  departure_time: string;
  travel_time: number;
  transportation: {
    type: TransportType;
  };
}

interface MergedType {
  id: string;
  search_ids: string[];
}

interface Range {
  enabled: boolean;
  width: number;
}

export interface TravelTimeBody {
  departure_searches: DepartureSearch[];
  intersections?: MergedType[];
  range?: Range;
}
