import { ActionType } from './actions'
import { Reducer } from 'redux'
import { POIApiResponse } from 'interfaces'

export interface State {
	primaryEducation: POIApiResponse | null
	secondaryEducation: POIApiResponse | null
}

const initialState: State = {
	primaryEducation: null,
	secondaryEducation: null
}

export type ActionDispatch = FetchPois

export const reducer: Reducer<State, ActionDispatch> = (state: State = initialState, action: ActionDispatch) => {
	switch (action.type) {
		case ActionType.FetchPois:
			return reduceSetZoomLevel(state, action)
		default:
			return state
	}
}

interface FetchPois {
	type: ActionType.FetchPois
	data: {
		primaryEducation: POIApiResponse | null
		secondaryEducation: POIApiResponse | null
	}
}

const reduceSetZoomLevel = (state: State, action: FetchPois) => {
	return {
		...state,
		...action.data
	}
}
