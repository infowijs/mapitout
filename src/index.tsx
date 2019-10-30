import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { BrowserRouter, Route } from 'react-router-dom'
import dotenv from 'dotenv'

import { configureStore } from 'store'
import { Map, App } from 'containers'

import 'react-app-polyfill/ie11'
import 'flexibility/flexibility'

import '../node_modules/normalize.css/normalize.css'
import './index.css'

dotenv.config()

const { store, persistor } = configureStore()

ReactDOM.render((
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
			<Map/>
            <BrowserRouter>
                <Route component={App} path='/:travelOne?/:travelTwo?/:travelThree?/:travelFour?/:travelFive?/:travelSix?'/>
            </BrowserRouter>
        </PersistGate>
    </Provider>
), document.getElementById('root'))
