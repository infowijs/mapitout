import { Address } from "../../../interfaces";

interface Coordinates {
  lat: number;
  lng: number;
}

export type SchoolDetailPin = Address & Coordinates;
