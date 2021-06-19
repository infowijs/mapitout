import { ActionType } from "./actions";
import { Reducer } from "redux";
import { TravelTimeResponse, TravelTimeStored } from "../../interfaces";

export interface State {
  loading: boolean;
  travelTimes: TravelTimeStored[] | null;
  overlap: TravelTimeResponse["results"][0] | null;
}

const initialState: State = {
  loading: false,
  travelTimes: null,
  overlap: null,
};

export type ActionDispatch =
  | SetLoading
  | GetTravelTimes
  | RemoveTravelTime
  | PurgeTravelTimes;

export const reducer: Reducer<State, ActionDispatch> = (
  state: State = initialState,
  action: ActionDispatch
) => {
  switch (action.type) {
    case ActionType.SetLoading:
      return reduceSetLoading(state, action);
    case ActionType.GetTravelTimes:
      return reduceGetTravelTimes(state, action);
    case ActionType.RemoveTravelTime:
      return reduceRemoveTravelTime(state, action);
    case ActionType.PurgeTravelTimes:
      return reducePurgeTravelTimes(state, action);
    default:
      return state;
  }
};

interface SetLoading {
  type: ActionType.SetLoading;
}

const reduceSetLoading = (state: State, action: SetLoading) => {
  return {
    ...state,
    loading: true,
  };
};

interface GetTravelTimes {
  type: ActionType.GetTravelTimes;
  data: {
    travelTimes: TravelTimeStored[];
    overlap: TravelTimeResponse["results"][0];
  };
}

const reduceGetTravelTimes = (state: State, action: GetTravelTimes) => {
  return {
    ...state,
    loading: false,
    travelTimes: action.data.travelTimes,
    overlap: action.data.overlap,
  };
};

interface RemoveTravelTime {
  type: ActionType.RemoveTravelTime;
  data: string;
}

const reduceRemoveTravelTime = (state: State, action: RemoveTravelTime) => {
  return {
    ...state,
    loading: false,
    travelTimes:
      state.travelTimes &&
      state.travelTimes.filter(
        (travelTime) => travelTime.res.search_id !== action.data
      ),
  };
};

interface PurgeTravelTimes {
  type: ActionType.PurgeTravelTimes;
}

const reducePurgeTravelTimes = (state: State, action: PurgeTravelTimes) => {
  return {
    ...state,
    loading: false,
    travelTimes: null,
    overlap: null,
  };
};
