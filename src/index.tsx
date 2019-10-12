import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { BrowserRouter, Route } from 'react-router-dom'

import { configureStore } from './store'
import { App } from './App'

import '../node_modules/normalize.css/normalize.css'

import dotenv from 'dotenv'
dotenv.config()

const { store, persistor } = configureStore()

ReactDOM.render((
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <BrowserRouter>
                <Route component={App} path='/:travelOne?/:travelTwo?/:travelThree?/:travelFour?/:travelFive?/:travelSix?'/>
            </BrowserRouter>
        </PersistGate>
    </Provider>
), document.getElementById('root'))
