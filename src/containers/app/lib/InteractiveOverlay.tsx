import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'

import { ReduxState, getTravelTimes, removeTravelTime, purgeTravelTimes } from 'store'
import { TravelType } from 'enums'
import { TravelTimeAbstraction } from 'interfaces'
import { colors } from '../../../constants'
import { TravelCard } from './TravelCard'
import { EditTravelTime } from './EditTravelTime'

const StyledUIContainer = styled.main`
	position: absolute;
	top: 0;
	left: 0;
`

interface StateProps {
	loading: ReduxState['travelTime']['loading']
	travelTimes: ReduxState['travelTime']['travelTimes']
}
interface DispatchProps {
	getTravelTimes: typeof getTravelTimes
	removeTravelTime: typeof removeTravelTime
	purgeTravelTimes: typeof purgeTravelTimes
}
interface Props {}
type PropsUnion = StateProps & DispatchProps & Props

interface State {
	currentTravelTimeEditing: string | null
	currentTravelTimeEditSaving: string | null
}

export class Component extends React.Component<PropsUnion, State> {
	public readonly state: State = {
		currentTravelTimeEditing: null,
		currentTravelTimeEditSaving: null
	}
	public addressFieldRef = React.createRef<any>()

	public componentDidUpdate(prevProps: Readonly<PropsUnion>, prevState: Readonly<State>, snapshot?: any): void {
		if (this.state.currentTravelTimeEditSaving) {
			this.setState({
				currentTravelTimeEditSaving: null
			})
		}
	}

	public render() {
		const {travelTimes} = this.props
		return (
			<StyledUIContainer>
				{travelTimes && travelTimes.map((travelTime, i) => travelTime.res.search_id === this.state.currentTravelTimeEditing
					? (
						<EditTravelTime
							key={travelTime.res.search_id}
							onFinish={(v: TravelTimeAbstraction) => this.save(travelTime.res.search_id, v)}
							onCancel={() => this.setState({currentTravelTimeEditing: null})}
							{...travelTime}
						/>
					) : (
						<TravelCard
							key={travelTime.res.search_id}
							color={colors[i]}
							title={travelTime.title}
							duration={travelTime.duration}
							transport={travelTime.transport}
							onDelete={() => this.removeTravelTime(travelTime.res.search_id)}
							onEdit={() => this.edit(travelTime.res.search_id)}
						/>
					)
				)}
			</StyledUIContainer>
		)
	}

	private edit = (id: string) => {
		this.setState({
			currentTravelTimeEditing: id
		}, () => this.setFocus())
	}

	private setFocus() {
		if (this.addressFieldRef.current) {
			this.addressFieldRef.current.focus()
		} else {
			setTimeout(() => this.setFocus(), 50)
		}
	}

	private save = (id: string, travelTime: TravelTimeAbstraction) => {
		const currentTravelTimes = this.props.travelTimes || []
		this.props.getTravelTimes(currentTravelTimes.map((t) => t.res.search_id === id ? travelTime : t))
		this.setState({
			currentTravelTimeEditSaving: id,
			currentTravelTimeEditing: null
		})
	}

	private addTravelTime = (travelTime: TravelTimeAbstraction) => {
		const currentTravelTimes = this.props.travelTimes || []
		this.props.getTravelTimes([
			...currentTravelTimes,
			travelTime
		])
	}

	private removeTravelTime = (id: string) => {
		const currentTravelTimes = this.props.travelTimes || []
		this.props.removeTravelTime(id)
		this.props.getTravelTimes([
			...currentTravelTimes.filter((travelTime) => travelTime.res.search_id !== id)
		])
	}

	private purgeTravelTimes = () => {
		this.props.purgeTravelTimes()
	}
}

const mapStateToProps = (state: ReduxState) => ({
	loading: state.travelTime.loading,
	travelTimes: state.travelTime.travelTimes
})

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
	getTravelTimes,
	removeTravelTime,
	purgeTravelTimes
}, dispatch)

export const InteractiveOverlay = connect<StateProps, DispatchProps, Props, ReduxState>(
	mapStateToProps,
	mapDispatchToProps
)(Component)
