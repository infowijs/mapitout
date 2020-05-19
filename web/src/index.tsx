import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter, Route } from 'react-router-dom'
import * as Sentry from '@sentry/browser'
// @ts-ignore
import scriptjs from 'scriptjs'
import dotenv from 'dotenv'

import { setupI18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'

import { configureStore } from 'store'
import { Map, App } from 'containers'
import { determineLanguage } from './locales/utils'
import catalogEn from './locales/en/messages.js'
import catalogNl from './locales/nl/messages.js'

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

export const i18n = setupI18n({
	language: determineLanguage(),
	catalogs: {
		en: catalogEn,
		nl: catalogNl
	}
})

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
			<I18nProvider language={i18n.language} i18n={i18n}>
				<Provider store={store}>
					<Map/>
					<BrowserRouter>
						<Route component={App} path='/:travelOne?/:travelTwo?/:travelThree?/:travelFour?/:travelFive?/:travelSix?'/>
					</BrowserRouter>
				</Provider>
			</I18nProvider>
		)
	}
}

ReactDOM.render(<Root/>, document.getElementById('root'))
