interface Coords {
  lat: number;
  lng: number;
}

interface Shape {
  shell: Coords[];
  holes: Array<Coords[]>;
}

export interface TravelTimeResponse {
  results: [
    {
      search_id: string;
      shapes: Shape[];
      properties: any;
    }
  ];
}
