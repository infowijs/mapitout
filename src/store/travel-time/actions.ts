import moment from 'moment'
import { AxiosResponse } from 'axios'

import { api } from '../../utils'
import { ActionDispatch } from './reducer'
import { TravelTimeAbstraction, TravelTimeBody, TravelTimeResponse } from '../../interfaces'

export enum ActionType {
    SetLoading = '@@travel-time/loading',
    GetTravelTimes = '@@travel-time/get',
	RemoveTravelTime = '@@travel-time/remove',
    PurgeTravelTimes = '@@travel-time/purge'
}

// NOTE: Since the API calculates the overlapping areas of all travels every time a new one is added, all the travels
// should be passed to the API and therefor also this function. The parameters of this function serve as an abstraction
// layer on top of the desired body format.
export function getTravelTimes(travels: TravelTimeAbstraction[]) {
	const travelsWithIds: Array<TravelTimeAbstraction & {id: string}> = travels.map((travel, i) => ({
		...travel,
		id: i.toString()
	}))

    const departure_time = moment() // Get the current data
            .utc() // Remove timezone details by setting it to UTC
            .day(8) // Set the date to the date of next monday
            .hour(9).minute(0).second(0).millisecond(0) // Set the time to 9:00 (AM)
            .format() // Turn the moment object into a string

    const data: TravelTimeBody = {
        departure_searches: travelsWithIds.map((travel, i) => ({
            id: travel.id,
            coords: travel.location,
            departure_time,
            travel_time: travel.duration,
            transportation: {
                type: travel.transport
            }
        })),
        unions: [
            {
                id: 'union',
                search_ids: []
            }
        ]
    }

    data.unions[0].search_ids = data.departure_searches.map((search) => search.id)

    return (dispatch: (action: ActionDispatch) => {}) => {
        dispatch({
            type: ActionType.SetLoading
        })

        api.post('/TravelTimeApi/v4/time-map', data)
            .then((res: AxiosResponse<TravelTimeResponse>) => {
                dispatch({
                    type: ActionType.GetTravelTimes,
                    data: {
                        travelTimes: travelsWithIds.map((travel) => ({
                            ...travel,
                            res: res.data.results.filter((result) => result.search_id === travel.id)[0]
                        })),
                        union: res.data.results.filter((result) => result.search_id === 'union')[0]
                    }
                })
            })
    }
}

// This method only removes the entry from the local data, in order to obtain a new union (in order to display the
// overlap between polygons) a call to `getTravelTimes` has to be made. This workaround is implemented because the
// back-end calculates the union, but the user should receive instantaneous feedback when removing a single travel-time
// item.
export function removeTravelTime(id: string) {
	return {
		type: ActionType.RemoveTravelTime,
		data: id
	}
}

export function purgeTravelTimes() {
    return {
        type: ActionType.PurgeTravelTimes
    }
}
