import { TravelType } from 'enums'

interface DepartureSearch {
    id: string,
    coords: {
        lat: number,
        lng: number
    },
    departure_time: string,
    travel_time: number,
    transportation: {
        type: TravelType
    }
}

interface MergedType {
    id: string,
    search_ids: string[]
}

export interface TravelTimeBody {
    departure_searches: DepartureSearch[]
	intersections: MergedType[]
	unions: MergedType[]
}
