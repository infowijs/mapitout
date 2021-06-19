import { TravelTimeResponse } from "./api/TravelTimeResponse";
import { TravelTimeAbstraction } from "./TravelTimeAbstraction";

export interface TravelTimeStored extends TravelTimeAbstraction {
  res: TravelTimeResponse["results"][0];
}
