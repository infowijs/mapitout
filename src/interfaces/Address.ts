export interface Address {
  lat: number;
  lng: number;
  schools: School[];
}

interface School {
  name: string;
  url: string;
  type: string | "primary" | "secondary" | "mixed";
  international: boolean;
}
