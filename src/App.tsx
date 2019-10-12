import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import { RouteComponentProps } from 'react-router-dom'
import styled from 'styled-components'

import { ReduxState, getTravelTimes, purgeTravelTimes } from './store'
import { TravelType } from './enums'

interface StateProps {
	loading: ReduxState['travelTime']['loading']
	travelTimes: ReduxState['travelTime']['travelTimes']
	overlap: ReduxState['travelTime']['overlap']
}
interface DispatchProps {
	getTravelTimes: typeof getTravelTimes
	purgeTravelTimes: typeof purgeTravelTimes
}
interface Props {}
type PropsUnion = StateProps & DispatchProps & Props & RouteComponentProps<Params>

interface State {}

interface Params {
	travelOne: string
	travelTwo: string
	travelThree: string
	travelFour: string
	travelFive: string
	travelSix: string
}

const encodingDivider = '--'

export class Component extends React.Component<PropsUnion, State> {
	public readonly state: State = {}

	constructor(props: PropsUnion) {
		super(props)

		const params = props.match.params

		const travelsEncoded: string[] = [
			params.travelOne,
			params.travelTwo,
			params.travelThree,
			params.travelFour,
			params.travelFive,
			params.travelSix
		].filter((v) => !!v)

		if (travelsEncoded.length === 0) return

		const travelsDecoded: Parameters<typeof getTravelTimes>[0] = travelsEncoded.map((encodedTravel) => {
			const [
				title,
				lat,
				lng,
				duration,
				transport
			] = encodedTravel.split(encodingDivider)

			return {
				title,
				location: {
					lat: parseFloat(lat),
					lng: parseFloat(lng)
				},
				duration: parseInt(duration, 10) * 60,
				transport: transport as TravelType
			}
		})

		props.getTravelTimes(travelsDecoded)
	}

	public componentDidUpdate(prevProps: Readonly<PropsUnion>, prevState: Readonly<State>, snapshot?: any): void {
		if (this.props.travelTimes && this.props.travelTimes !== prevProps.travelTimes) {
			const path: string = this.props.travelTimes.map((travelTime) => {
				return [
					travelTime.title,
					travelTime.location.lat,
					travelTime.location.lng,
					travelTime.duration / 60,
					travelTime.transport
				].join(encodingDivider)
			}).join('/')

			this.props.history.replace('/' + path)
		}
	}

	public render() {
		const {loading, travelTimes, overlap} = this.props

		return (
			<div>
				<h1>App</h1>
			</div>
		)
	}

	private addTravelTime = (title: string, location: {lat: number, lng: number}, duration: number, transport: TravelType) => {
		const currentTravelTimes = this.props.travelTimes || []
		this.props.getTravelTimes([
			...currentTravelTimes,
			{
				title,
				location,
				duration,
				transport
			}
		])
	}

	private removeTravelTime = (id: string) => {
		const currentTravelTimes = this.props.travelTimes || []
		this.props.getTravelTimes([
			...currentTravelTimes.filter((travelTime) => travelTime.res.search_id !== id)
		])
	}

	private purgeTravelTimes = () => {
		this.props.purgeTravelTimes()
		this.props.history.replace('/')
	}
}

const mapStateToProps = (state: ReduxState) => ({
	loading: state.travelTime.loading,
	travelTimes: state.travelTime.travelTimes,
	overlap: state.travelTime.overlap
})

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
	getTravelTimes,
	purgeTravelTimes
}, dispatch)

export const App = connect<StateProps, DispatchProps, Props, ReduxState>(
	mapStateToProps,
	mapDispatchToProps
)(Component)
