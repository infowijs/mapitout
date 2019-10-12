import { ReduxState } from './configureStore'

// NOTE: Normally barrel files can just re-export types, unfortunately CRA always enables the --isolatedModules flag,
// causing a TS1205 error. A workaround is to cast them to a type with the same name and export that.

export type ReduxState = ReduxState
export { configureStore } from './configureStore'
export { getTravelTimes, purgeTravelTimes } from './travel-time/actions'
