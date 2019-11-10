import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import { OverlayView } from 'react-google-maps'
import styled, { css } from 'styled-components'

import { ReduxState, setTooltip, getTravelTimes } from 'store'
import { AddIcon } from 'icons'
import { TravelTimeAbstraction } from 'interfaces'
import { TransportType } from 'enums'
import { shadows } from '../../../constants'

const StyledTooltip = styled.div`
	position: relative;
	width: 250px;
	${shadows.normal};
	border-radius: 5px;
	background-color: #fff;
	font-size: 1rem;
	
	:after {
		content: '';
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translate(-50%, -50%) rotate(45deg);
		border-bottom-right-radius: 3px;
		width: 10px;
		height: 10px;
		background-color: white;
	}
`

const StyledTooltipHeader = styled.div`
	background-color: #1BAABD;
	padding: .75rem;
	color: #fff;
	border-top-left-radius: 5px;
	border-top-right-radius: 5px;
`

const StyledContentContainer = styled.div<{isDisabled: boolean}>`
	cursor: ${(props) => props.isDisabled ? 'default' : 'pointer'};
	${(props) => props.isDisabled && css`
		opacity: .5
	`};
	padding: .75rem;
	display: flex;
	flex-direction: row;
	align-items: center;
`

const StyledIconContainer = styled.div<{isDisabled: boolean}>`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 1.5rem;
	height: 1.5rem;
	margin-right: .5rem;
	background-color: rgba(0, 0, 0, .1);
	transition: 100ms;
	border-radius: 99px;
	
	& > * {
		max-width: 1rem;
		max-height: 1rem;
	}
	
	${StyledContentContainer}:hover & {
		${(props) => !props.isDisabled && css`
			transform: scale(1.2);
		`};
	}
`

interface StateProps {
	travelTimes: ReduxState['travelTime']['travelTimes']
	tooltip: ReduxState['application']['tooltip']
}
interface DispatchProps {
	setTooltip: typeof setTooltip
	getTravelTimes: typeof getTravelTimes
}
interface Props {}
type PropsUnion = StateProps & DispatchProps & Props

interface State {}

export class Component extends React.Component<PropsUnion, State> {
	public readonly state: State = {}

	public render() {
		const {tooltip, travelTimes} = this.props

		if (!tooltip) return null

		return (
			<OverlayView
				position={tooltip.location}
				mapPaneName={OverlayView.FLOAT_PANE}
				getPixelPositionOffset={(width, height) => ({
					x: -(width / 2),
					y: -height
				})}
			>
				<StyledTooltip>
					<StyledTooltipHeader>{tooltip.title}</StyledTooltipHeader>
					<StyledContentContainer
						isDisabled={!!(travelTimes && travelTimes.length >= 6)}
						onClick={() => {
							if (travelTimes && travelTimes.length >= 6) return
							this.addTravelTime({
								...tooltip!,
								duration: 30 * 60,
								transport: TransportType.PublicTransport
							})
						}}
					>
						<StyledIconContainer
							isDisabled={!!(travelTimes && travelTimes.length >= 6)}
						>
							<AddIcon/>
						</StyledIconContainer>
						<p>Add this location</p>
					</StyledContentContainer>
				</StyledTooltip>
			</OverlayView>
		)
	}

	private addTravelTime = (travelTime: TravelTimeAbstraction) => {
		const currentTravelTimes = this.props.travelTimes || []
		this.props.getTravelTimes([
			...currentTravelTimes,
			travelTime
		])
		this.setState({
			isCurrentlyAddingNewTravelTime: false
		})
	}
}

const mapStateToProps = (state: ReduxState) => ({
	travelTimes: state.travelTime.travelTimes,
	tooltip: state.application.tooltip
})
const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
	setTooltip,
	getTravelTimes
}, dispatch)

export const Tooltip = connect<StateProps, DispatchProps, Props, ReduxState>(
	mapStateToProps,
	mapDispatchToProps
)(Component)
