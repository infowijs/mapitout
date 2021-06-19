import { ReduxState } from "./configureStore";

// NOTE: Normally barrel files can just re-export types, unfortunately CRA always enables the --isolatedModules flag,
// causing a TS1205 error. A workaround is to cast them to a type with the same name and export that.

export type ReduxState = ReduxState;
export { configureStore } from "./configureStore";

export {
  getTravelTimes,
  removeTravelTime,
  purgeTravelTimes,
} from "./travel-time/actions";
export {
  setZoomLevel,
  setOverlapState,
  setTooltip,
  setSchoolDetailPin,
  setNewTravelTimeDetails,
  setPrimaryEducationVisibility,
  setSecondaryEducationVisibility,
  setOnlyInternationalVisibility,
  setFaqVisibility,
  setDemoVisibility,
  setBlogVisibility,
} from "./application/actions";
