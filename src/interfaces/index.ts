import { POIApiResponse } from "./api/POIApiResponse";
import { TravelTimeBody } from "./api/TravelTimeBody";
import { TravelTimeResponse } from "./api/TravelTimeResponse";

import { Address } from "./Address";
import { TravelTimeAbstraction } from "./TravelTimeAbstraction";
import { TravelTimeStored } from "./TravelTimeStored";

// NOTE: Normally barrel files can just re-export types, unfortunately CRA always enables the --isolatedModules flag,
// causing a TS1205 error. A workaround is to cast them to a type with the same name and export that.

export type POIApiResponse = POIApiResponse;
export type TravelTimeBody = TravelTimeBody;
export type TravelTimeResponse = TravelTimeResponse;

export type Address = Address;
export type TravelTimeAbstraction = TravelTimeAbstraction;
export type TravelTimeStored = TravelTimeStored;
