import { ActionDispatch } from './reducer'
import {Tooltip} from './lib/Tooltip'

export enum ActionType {
	SetZoomLevel = '@@application/zoom',
	SetOverlapState = '@@application/overlap',
	SetTooltip = '@@application/tooltip',
	SetPrimaryEducationVisibility = '@@application/primary-education',
	SetSecondaryEducationVisibility = '@@application/secondary-education'
}

export function setZoomLevel(level: number) {
	return (dispatch: (action: ActionDispatch) => {}) => {
		dispatch({
			type: ActionType.SetZoomLevel,
			data: level
		})
	}
}

export function setOverlapState(displayEnabled: boolean) {
	return (dispatch: (action: ActionDispatch) => {}) => {
		dispatch({
			type: ActionType.SetOverlapState,
			data: displayEnabled
		})
	}
}

export function setTooltip(tooltip: Tooltip) {
	return (dispatch: (action: ActionDispatch) => {}) => {
		dispatch({
			type: ActionType.SetTooltip,
			data: tooltip
		})
	}
}

export function setPrimaryEducationVisibility(visible: boolean) {
	return (dispatch: (action: ActionDispatch) => {}) => {
		dispatch({
			type: ActionType.SetPrimaryEducationVisibility,
			data: visible
		})
	}
}

export function setSecondaryEducationVisibility(visible: boolean) {
	return (dispatch: (action: ActionDispatch) => {}) => {
		dispatch({
			type: ActionType.SetSecondaryEducationVisibility,
			data: visible
		})
	}
}
