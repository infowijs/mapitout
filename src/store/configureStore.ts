import { applyMiddleware, createStore, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

import {
  reducer as applicationReducer,
  State as ApplicationState,
} from "./application/reducer";
import {
  reducer as travelTimeReducer,
  State as TravelTimeState,
} from "./travel-time/reducer";

export interface ReduxState {
  application: ApplicationState;
  travelTime: TravelTimeState;
}

const rootReducer = combineReducers({
  application: applicationReducer,
  travelTime: travelTimeReducer,
});

export const configureStore = () => {
  if (process.env.NODE_ENV === "production") {
    return createStore(rootReducer, applyMiddleware(thunk));
  } else {
    return createStore(
      rootReducer,
      composeWithDevTools(applyMiddleware(thunk))
    );
  }
};
