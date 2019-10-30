import { ActionType } from './actions'
import { Reducer } from 'redux'
import {Tooltip} from './lib/Tooltip'

export interface State {
	zoom: number
	overlapVisible: boolean
	tooltip: Tooltip | null
	primaryEducationVisible: boolean
	secondaryEducationVisible: boolean
}

const initialState: State = {
	zoom: 10,
	overlapVisible: false,
	tooltip: null,
	primaryEducationVisible: false,
	secondaryEducationVisible: false
}

export type ActionDispatch = SetZoomLevel
	| SetOverlapState
	| SetTooltip
	| SetPrimaryEducationVisibility
	| SetSecondaryEducationVisibility

export const reducer: Reducer<State, ActionDispatch> = (state: State = initialState, action: ActionDispatch) => {
	switch (action.type) {
		case ActionType.SetZoomLevel:
			return reduceSetZoomLevel(state, action)
		case ActionType.SetOverlapState:
			return reduceSetOverlapState(state, action)
		case ActionType.SetTooltip:
			return reduceSetTooltip(state, action)
		case ActionType.SetPrimaryEducationVisibility:
			return reduceSetPrimaryEducationVisibility(state, action)
		case ActionType.SetSecondaryEducationVisibility:
			return reduceSetSecondaryEducationVisibility(state, action)
		default:
			return state
	}
}

interface SetZoomLevel {
	type: ActionType.SetZoomLevel
	data: number
}

const reduceSetZoomLevel = (state: State, action: SetZoomLevel) => {
	return {
		...state,
		zoom: action.data
	}
}

interface SetOverlapState {
	type: ActionType.SetOverlapState
	data: boolean
}

const reduceSetOverlapState = (state: State, action: SetOverlapState) => {
	return {
		...state,
		overlapVisible: action.data
	}
}

interface SetTooltip {
	type: ActionType.SetTooltip
	data: Tooltip
}

const reduceSetTooltip = (state: State, action: SetTooltip) => {
	return {
		...state,
		tooltip: state.tooltip === null ? action.data : null
	}
}

interface SetPrimaryEducationVisibility {
	type: ActionType.SetPrimaryEducationVisibility
	data: boolean
}

const reduceSetPrimaryEducationVisibility = (state: State, action: SetPrimaryEducationVisibility) => {
	return {
		...state,
		primaryEducationVisible: action.data
	}
}

interface SetSecondaryEducationVisibility {
	type: ActionType.SetSecondaryEducationVisibility
	data: boolean
}

const reduceSetSecondaryEducationVisibility = (state: State, action: SetSecondaryEducationVisibility) => {
	return {
		...state,
		secondaryEducationVisible: action.data
	}
}
