import { ActionDispatch } from "./reducer";
import { Tooltip } from "./lib/Tooltip";
import { TravelTimeAbstraction } from "../../interfaces";
import { SchoolDetailPin } from "./lib/SchoolDetailPin";

export enum ActionType {
  SetZoomLevel = "@@application/zoom",
  SetOverlapState = "@@application/overlap",
  SetTooltip = "@@application/tooltip",
  SetSchoolDetailPin = "@@application/school-detail-pin",
  SetNewTravelTimeDetails = "@@application/new-travel-time",
  SetPrimaryEducationVisibility = "@@application/primary-education",
  SetSecondaryEducationVisibility = "@@application/secondary-education",
  SetOnlyInternationalVisibility = "@@application/international",
  SetFaqVisibility = "@@application/faqVisiblity",
  SetDemoVisibility = "@@application/demoVisiblity",
  SetBlogVisibility = "@@application/blogVisiblity",
}

export function setZoomLevel(level: number) {
  return (dispatch: (action: ActionDispatch) => {}) => {
    dispatch({
      type: ActionType.SetZoomLevel,
      data: level,
    });
  };
}

export function setOverlapState(displayEnabled: boolean) {
  return (dispatch: (action: ActionDispatch) => {}) => {
    dispatch({
      type: ActionType.SetOverlapState,
      data: displayEnabled,
    });
  };
}

export function setTooltip(tooltip: Tooltip | null) {
  return (dispatch: (action: ActionDispatch) => {}) => {
    dispatch({
      type: ActionType.SetTooltip,
      data: tooltip,
    });
  };
}

export function setSchoolDetailPin(pin: SchoolDetailPin | null) {
  return (dispatch: (action: ActionDispatch) => {}) => {
    dispatch({
      type: ActionType.SetSchoolDetailPin,
      data: pin,
    });
  };
}

export function setNewTravelTimeDetails(
  travelTime: Partial<TravelTimeAbstraction> | null
) {
  return (dispatch: (action: ActionDispatch) => {}) => {
    dispatch({
      type: ActionType.SetNewTravelTimeDetails,
      data: travelTime,
    });
  };
}

export function setPrimaryEducationVisibility(visible: boolean) {
  return (dispatch: (action: ActionDispatch) => {}) => {
    dispatch({
      type: ActionType.SetPrimaryEducationVisibility,
      data: visible,
    });
  };
}

export function setSecondaryEducationVisibility(visible: boolean) {
  return (dispatch: (action: ActionDispatch) => {}) => {
    dispatch({
      type: ActionType.SetSecondaryEducationVisibility,
      data: visible,
    });
  };
}

export function setOnlyInternationalVisibility(visible: boolean) {
  return (dispatch: (action: ActionDispatch) => {}) => {
    dispatch({
      type: ActionType.SetOnlyInternationalVisibility,
      data: visible,
    });
  };
}

export function setFaqVisibility(visible: boolean) {
  return (dispatch: (action: ActionDispatch) => {}) => {
    dispatch({
      type: ActionType.SetFaqVisibility,
      data: visible,
    });
  };
}

export function setBlogVisibility(status: number) {
  return (dispatch: (action: ActionDispatch) => {}) => {
    dispatch({
      type: ActionType.SetBlogVisibility,
      data: status,
    });
  };
}

export function setDemoVisibility(visible: boolean) {
  return (dispatch: (action: ActionDispatch) => {}) => {
    dispatch({
      type: ActionType.SetDemoVisibility,
      data: visible,
    });
  };
}
