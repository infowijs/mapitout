import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import { OverlayView, Polygon, Marker } from 'react-google-maps'
import MarkerClusterer from 'react-google-maps/lib/components/addons/MarkerClusterer'
import simplify from 'simplify-js'
import styled, { createGlobalStyle, css } from 'styled-components'

import { ReduxState, setTooltip, getTravelTimes } from 'store'
import {bspline, colorList, getTravelTypeInfo} from 'utils'
import { AddIcon } from 'icons'
import { TravelTimeAbstraction } from 'interfaces'
import { TravelType } from 'enums'
import { colors, shadows } from '../../../constants'

import educationMarkerIcon from '../../../icons/education-cluster.svg'

const StyledMarker = styled.div<{color: string, minimalStyle: boolean}>`
	position: relative;
	width: ${(props) => props.minimalStyle ? '.5rem' : '2rem'};
	height: ${(props) => props.minimalStyle ? '.5rem' : '2rem'};
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 99px;
	background-color: ${(props) => props.color};
	color: #fff;
	z-index: 0;
	
	${(props) => props.minimalStyle && css`
		& > * {
			opacity: 0;
		}
	`};
	
	&:before, &:after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-radius: 99px;
		background-color: ${(props) => props.color};
		z-index: -1;
	}
	
	&:before {
		transform: ${(props) => props.minimalStyle ? 'scale(2.5)' : 'scale(1.8)'};
		opacity: .5;
	}
	
	&:after {
		transform: ${(props) => props.minimalStyle ? 'scale(4)' : 'scale(3)'};
		opacity: .25;
	}
`

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

const ClusterMarkerGlobalStyles = createGlobalStyle`
	.cluster {
		position: relative;
		z-index: 0;
		
		:after {
			content: '';
			position: absolute;
			width: 60px;
			height: 60px;
			border-radius: 999px;
			z-index: -1;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			background: radial-gradient(rgba(255, 255, 255, .75) 0%, transparent 75%);
			opacity: .5;
			transition: 100ms;
		}
		
		:hover:after {
			width: 80px;
			height: 80px;
			opacity: 1;
		}
	}
	.cluster-marker-text-container {
		text-align: left;
		
		p {
			display: inline;
			padding: 2px 6px;
			border-radius: 99px;
			background-color: #1BBD9D;
			text-align: left;
		}
	}
`

interface StateProps {
	travelTimes: ReduxState['travelTime']['travelTimes']
	overlap: ReduxState['travelTime']['overlap']
	zoom: ReduxState['application']['zoom']
	overlapVisible: ReduxState['application']['overlapVisible']
	tooltip: ReduxState['application']['tooltip'],
	primaryEducation: ReduxState['travelTime']['primaryEducation']
	secondaryEducation: ReduxState['travelTime']['secondaryEducation']
	primaryEducationVisible: ReduxState['application']['primaryEducationVisible']
	secondaryEducationVisible: ReduxState['application']['secondaryEducationVisible']
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
		return (
			<>
				{this.renderPolygons()}
				{this.renderMarkers()}
				{this.renderPois()}
				{this.renderTooltip()}
			</>
		)
	}

	private renderPolygons() {
		return (
			<>
				{this.props.overlap && this.props.overlap.shapes.map((shape, i) =>
					shape.shell.length > 10 && this.renderPolygon(
						`overlap:${i}`,
						'#000',
						shape,
						this.props.overlapVisible
					)
				)}
				{this.props.travelTimes && this.props.travelTimes.map((travelTime, i) =>
					travelTime.res.shapes.map((shape, j) =>
						shape.shell.length > 10 && this.renderPolygon(
							`${travelTime.res.search_id}:${j}`,
							colorList[i],
							shape,
							!this.props.overlapVisible
						)
					)
				)}
			</>
		)
	}

	private renderPolygon(key: string, color: string, shape: NonNullable<StateProps['overlap']>['shapes'][0], visible: boolean) {
		return (
			<Polygon
				key={key}
				options={{
					clickable: false,
					strokeColor: color,
					fillColor: color,
					strokeOpacity: 1,
					strokeWeight: 2.5,
					fillOpacity: .1
				}}
				paths={[
					this.getSmoothShape(shape.shell),
					...shape.holes.filter((hole) => hole.length > 15).map((hole) => this.getSmoothShape(hole))
				]}
				visible={visible}
			/>
		)
	}

	private renderMarkers() {
		return (
			<>
				{this.props.travelTimes && this.props.travelTimes.map((travelTime, i) => (
					<OverlayView
						key={i}
						position={travelTime.location}
						mapPaneName={OverlayView.MARKER_LAYER}
						getPixelPositionOffset={(width, height) => ({
							x: -(width / 2),
							y: -(height / 2)
						})}
					>
						<StyledMarker color={colorList[i]} minimalStyle={this.props.overlapVisible}>
							{getTravelTypeInfo(travelTime.transport).icon}
						</StyledMarker>
					</OverlayView>
				))}
			</>
		)
	}

	private renderPois() {
		const markers = this.props.zoom > 12 ? [
			...(this.props.primaryEducationVisible && this.props.primaryEducation) || [],
			...(this.props.secondaryEducationVisible && this.props.secondaryEducation) || []
		] : []
		return (
			<>
				<ClusterMarkerGlobalStyles/>
				<MarkerClusterer
					averageCenter
					enableRetinaIcons
					ignoreHidden
					calculator={(markers: any[], numStyles: number) => ({
						text: `<div class='cluster-marker-text-container'><p>${markers.length <= 50 ? markers.length : '50+'}</p></div>`,
						index: Math.min(0, numStyles),
						title: ''
					})}
					styles={[
						{
							textColor: '#fff',
							url: educationMarkerIcon,
							height: 30,
							width: 30,
							anchorText: [-15, 15 + 5]
						}
					]}
				>
					{markers.map((v, i) => (
						<Marker
							key={i}
							position={{
								lat: v[0].geo_location.coordinates[1],
								lng: v[0].geo_location.coordinates[0]
							}}
							icon={educationMarkerIcon}
						/>
					))}
				</MarkerClusterer>
			</>
		)
	}

	private renderTooltip() {
		if (!this.props.tooltip) return null

		return (
			<OverlayView
				position={this.props.tooltip.location}
				mapPaneName={OverlayView.FLOAT_PANE}
				getPixelPositionOffset={(width, height) => ({
					x: -(width / 2),
					y: -height
				})}
			>
				<StyledTooltip>
					<StyledTooltipHeader>{this.props.tooltip.title}</StyledTooltipHeader>
					<StyledContentContainer
						isDisabled={!!(this.props.travelTimes && this.props.travelTimes.length >= 6)}
						onClick={() => {
							if (this.props.travelTimes && this.props.travelTimes.length >= 6) return
							this.addTravelTime({
								...this.props.tooltip!,
								duration: 30 * 60,
								transport: TravelType.PublicTransport
							})
						}}
					>
						<StyledIconContainer
							isDisabled={!!(this.props.travelTimes && this.props.travelTimes.length >= 6)}
						>
							<AddIcon/>
						</StyledIconContainer>
						<p>Add this location</p>
					</StyledContentContainer>
				</StyledTooltip>
			</OverlayView>
		)
	}

	private getSmoothShape(coordinates: Array<{lat: number, lng: number}>) {
		const progress = Math.max(Math.min(1 - (this.props.zoom - 7) / (12 - 7), 1), 0)
		const simplifiedShape = simplify(coordinates.map((coordinate) => ({
			x: coordinate.lat,
			y: coordinate.lng
		})), 0.01 * progress * Math.min(coordinates.length / 500, 1), false)

		return bspline(
			simplifiedShape.map((coord: any) => coord.x),
			simplifiedShape.map((coord: any) => coord.y),
			0.05
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
	overlap: state.travelTime.overlap,
	zoom: state.application.zoom,
	overlapVisible: state.application.overlapVisible,
	tooltip: state.application.tooltip,
	primaryEducation: state.travelTime.primaryEducation,
	secondaryEducation: state.travelTime.secondaryEducation,
	primaryEducationVisible: state.application.primaryEducationVisible,
	secondaryEducationVisible: state.application.secondaryEducationVisible
})
const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
	setTooltip,
	getTravelTimes
}, dispatch)

export const MapContent = connect<StateProps, DispatchProps, Props, ReduxState>(
	mapStateToProps,
	mapDispatchToProps
)(Component)
