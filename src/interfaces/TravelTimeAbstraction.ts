import { TransportType } from "../enums";

export interface TravelTimeAbstraction {
  title: string; // Address, but could possibly be a custom name
  location: {
    title: string;
    lat: number;
    lng: number;
  };
  duration: number; // Travel duration in seconds
  transport: TransportType;
}
