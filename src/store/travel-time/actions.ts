
import { ActionDispatch } from './reducer'

export enum ActionType {
    SetLoading = '@@travel-time/loading',
    GetTravelTimes = '@@travel-time/get',
    PurgeTravelTimes = '@@travel-time/purge'
}

