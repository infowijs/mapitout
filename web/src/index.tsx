import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter, Route } from 'react-router-dom'
import * as Sentry from '@sentry/browser'
// @ts-ignore
import scriptjs from 'scriptjs'
import dotenv from 'dotenv'

import { configureStore } from 'store'
import { Map, App } from 'containers'

import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'
import 'flexibility/flexibility'

import '../node_modules/normalize.css/normalize.css'
import './index.css'

dotenv.config()

if (process.env.REACT_APP_SENTRY_DSN) {
	Sentry.init({dsn: process.env.REACT_APP_SENTRY_DSN})
}

const store = configureStore()

class Root extends React.Component<{}, {loaded: boolean}> {
	public readonly state = {
		loaded: false
	}
	public componentDidMount(): void {
		scriptjs(`https://maps.googleapis.com/maps/api/js?v=3&key=${process.env.REACT_APP_GOOGLE_MAPS_TOKEN}&v=3.exp&libraries=geometry,drawing,places`, () => this.setState({loaded: true}))
	}

	public render() {
		if (!this.state.loaded) return null

		return (
			<Provider store={store}>
				<Map/>
				<BrowserRouter>
					<Route component={App} path='/:travelOne?/:travelTwo?/:travelThree?/:travelFour?/:travelFive?/:travelSix?'/>
				</BrowserRouter>
			</Provider>
		)
	}
}

ReactDOM.render(<Root/>, document.getElementById('root'))
