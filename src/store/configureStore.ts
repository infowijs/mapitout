import { applyMiddleware, createStore, combineReducers } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import storage from 'redux-persist/lib/storage'

import { reducer as applicationReducer, State as ApplicationState } from './application/reducer'
import { reducer as travelTimeReducer, State as TravelTimeState } from './travel-time/reducer'

export interface ReduxState {
	application: ApplicationState
	travelTime: TravelTimeState
}

const persistConfig = {
    version: 1,
    key: 'mapitout',
    storage,
	blacklist: [
		'application'
	]
}

const rootReducer = combineReducers({
	application: applicationReducer,
	travelTime: travelTimeReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const configureStore = () => {
    let store
    if (process.env.NODE_ENV === 'production') {
        store = createStore(persistedReducer, applyMiddleware(thunk))
    } else {
        store = createStore(persistedReducer, composeWithDevTools(applyMiddleware(thunk)))
    }

    let persistor = persistStore(store)

    return { store, persistor }
}
