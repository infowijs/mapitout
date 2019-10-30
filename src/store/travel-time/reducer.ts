import { ActionType } from './actions'
import { Reducer } from 'redux'
import { POIApiResponse, TravelTimeResponse, TravelTimeStored } from '../../interfaces'

export interface State {
    loading: boolean
    travelTimes: TravelTimeStored[] | null
    overlap: TravelTimeResponse['results'][0] | null
	primaryEducation: POIApiResponse | null
	secondaryEducation: POIApiResponse | null
}

const initialState: State = {
    loading: false,
    travelTimes: null,
    overlap: null,
	primaryEducation: null,
	secondaryEducation: null
}

export type ActionDispatch = SetLoading
    | GetTravelTimes
	| RemoveTravelTime
    | PurgeTravelTimes
	| GetPOIs

export const reducer: Reducer<State, ActionDispatch> = (state: State = initialState, action: ActionDispatch) => {
    switch (action.type) {
        case ActionType.SetLoading:
            return reduceSetLoading(state, action)
        case ActionType.GetTravelTimes:
            return reduceGetTravelTimes(state, action)
		case ActionType.RemoveTravelTime:
			return reduceRemoveTravelTime(state, action)
        case ActionType.PurgeTravelTimes:
            return reducePurgeTravelTimes(state, action)
		case ActionType.GetPOIs:
			return reduceGetPOIs(state, action)
        default:
            return state
    }
}

interface SetLoading {
    type: ActionType.SetLoading
}

const reduceSetLoading = (state: State, action: SetLoading) => {
    return {
        ...state,
        loading: true
    }
}

interface GetTravelTimes {
    type: ActionType.GetTravelTimes
    data: {
        travelTimes: TravelTimeStored[]
		overlap: TravelTimeResponse['results'][0]
    }
}

const reduceGetTravelTimes = (state: State, action: GetTravelTimes) => {
    return {
        ...state,
        loading: false,
        travelTimes: action.data.travelTimes,
        overlap: action.data.overlap
    }
}

interface RemoveTravelTime {
	type: ActionType.RemoveTravelTime,
	data: string
}

const reduceRemoveTravelTime = (state: State, action: RemoveTravelTime) => {
	return {
		...state,
		loading: false,
		travelTimes: state.travelTimes && state.travelTimes.filter((travelTime) => travelTime.res.search_id !== action.data)
	}
}

interface PurgeTravelTimes {
    type: ActionType.PurgeTravelTimes
}

const reducePurgeTravelTimes = (state: State, action: PurgeTravelTimes) => {
    return {
        ...state,
        loading: false,
        travelTimes: null,
        overlap: null
    }
}

interface GetPOIs {
	type: ActionType.GetPOIs,
	data: {
		type: 'Primary education' | 'Secondary education'
		res: POIApiResponse
	}
}

const reduceGetPOIs = (state: State, action: GetPOIs) => {
	return {
		...state,
		...action.data.type === 'Primary education' && {primaryEducation: action.data.res},
		...action.data.type === 'Secondary education' && {secondaryEducation: action.data.res},
	}
}
