import { ActionType } from './actions'
import { Reducer } from 'redux'
import { Tooltip } from './lib/Tooltip'
import { TravelTimeAbstraction } from 'interfaces'
import { SchoolDetailPin } from './lib/SchoolDetailPin'

export interface State {
	zoom: number
	overlapVisible: boolean
	tooltip: Tooltip | null
	schoolDetailPin: SchoolDetailPin | null
	newTravelTimeDetails: Partial<TravelTimeAbstraction> | null
	primaryEducationVisible: boolean
	secondaryEducationVisible: boolean
	onlyInternationalVisibility: boolean
	faqVisible: boolean
	demoVisible: boolean
}

const initialState: State = {
	zoom: 10,
	overlapVisible: false,
	tooltip: null,
	schoolDetailPin: null,
	newTravelTimeDetails: null,
	primaryEducationVisible: false,
	secondaryEducationVisible: false,
	onlyInternationalVisibility: false,
	faqVisible: false,
	demoVisible: false
}

export type ActionDispatch = SetZoomLevel
	| SetOverlapState
	| SetTooltip
	| SetSchoolDetailPin
	| SetNewTravelTimeDetails
	| SetPrimaryEducationVisibility
	| SetSecondaryEducationVisibility
	| SetOnlyInternationalVisibility
	| SetFaqVisibility
	| SetDemoVisibility

export const reducer: Reducer<State, ActionDispatch> = (state: State = initialState, action: ActionDispatch) => {
	switch (action.type) {
		case ActionType.SetZoomLevel:
			return reduceSetZoomLevel(state, action)
		case ActionType.SetOverlapState:
			return reduceSetOverlapState(state, action)
		case ActionType.SetTooltip:
			return reduceSetTooltip(state, action)
		case ActionType.SetSchoolDetailPin:
			return reduceSetSchoolDetailPin(state, action)
		case ActionType.SetNewTravelTimeDetails:
			return reduceSetNewTravelTimeDetails(state, action)
		case ActionType.SetPrimaryEducationVisibility:
			return reduceSetPrimaryEducationVisibility(state, action)
		case ActionType.SetSecondaryEducationVisibility:
			return reduceSetSecondaryEducationVisibility(state, action)
		case ActionType.SetOnlyInternationalVisibility:
			return reduceSetOnlyInternationalVisibility(state, action)
		case ActionType.SetFaqVisibility:
			return reduceSetFaqVisibility(state, action)
		case ActionType.SetDemoVisibility:
			return reduceSetDemoVisibility(state, action)
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
	data: Tooltip | null
}

const reduceSetTooltip = (state: State, action: SetTooltip) => {
	return {
		...state,
		tooltip: action.data
	}
}

interface SetSchoolDetailPin {
	type: ActionType.SetSchoolDetailPin
	data: SchoolDetailPin | null
}

const reduceSetSchoolDetailPin = (state: State, action: SetSchoolDetailPin) => {
	return {
		...state,
		schoolDetailPin: action.data
	}
}

interface SetNewTravelTimeDetails {
	type: ActionType.SetNewTravelTimeDetails
	data: Partial<TravelTimeAbstraction> | null
}

const reduceSetNewTravelTimeDetails = (state: State, action: SetNewTravelTimeDetails) => {
	return {
		...state,
		newTravelTimeDetails: action.data
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

interface SetOnlyInternationalVisibility {
	type: ActionType.SetOnlyInternationalVisibility
	data: boolean
}

const reduceSetOnlyInternationalVisibility = (state: State, action: SetOnlyInternationalVisibility) => {
	return {
		...state,
		onlyInternationalVisibility: action.data
	}
}

interface SetFaqVisibility {
	type: ActionType.SetFaqVisibility
	data: boolean
}

const reduceSetFaqVisibility = (state: State, action: SetFaqVisibility) => {
	return {
		...state,
		faqVisible: action.data
	}
}

interface SetDemoVisibility {
	type: ActionType.SetDemoVisibility
	data: boolean
}

const reduceSetDemoVisibility = (state: State, action: SetDemoVisibility) => {
	return {
		...state,
		demoVisible: action.data
	}
}
