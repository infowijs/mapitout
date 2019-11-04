import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import { Marker } from 'react-google-maps'
import MarkerClusterer from 'react-google-maps/lib/components/addons/MarkerClusterer'
import { createGlobalStyle } from 'styled-components'

import { ReduxState } from 'store'

import educationMarkerIcon from '../../../icons/education-cluster.svg'

const ClusterMarkerGlobalStyles = createGlobalStyle`
	.cluster {
		position: relative;
		z-index: 0;
		
		@media (min-width: 900px) {		
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
	zoom: ReduxState['application']['zoom']
	primaryEducation: ReduxState['travelTime']['primaryEducation']
	secondaryEducation: ReduxState['travelTime']['secondaryEducation']
	primaryEducationVisible: ReduxState['application']['primaryEducationVisible']
	secondaryEducationVisible: ReduxState['application']['secondaryEducationVisible']
}
interface DispatchProps {}
interface Props {}
type PropsUnion = StateProps & DispatchProps & Props

interface State {}

const zoomLevelTolerance = 12
export class Component extends React.Component<PropsUnion, State> {
	public readonly state: State = {}

	public shouldComponentUpdate(nextProps: Readonly<PropsUnion>, nextState: Readonly<State>, nextContext: any): boolean {
		if (
			this.props.primaryEducation !== nextProps.primaryEducation
			|| this.props.secondaryEducation !== nextProps.secondaryEducation
			|| this.props.primaryEducationVisible !== nextProps.primaryEducationVisible
			|| this.props.secondaryEducationVisible !== nextProps.secondaryEducationVisible
		) {
			return true
		}

		return !(this.props.zoom === nextProps.zoom
			|| (this.props.zoom >= zoomLevelTolerance && nextProps.zoom >= zoomLevelTolerance)
			|| (this.props.zoom < zoomLevelTolerance && nextProps.zoom < zoomLevelTolerance))
	}

	public render() {
		const {
			zoom,
			primaryEducationVisible,
			primaryEducation,
			secondaryEducationVisible,
			secondaryEducation
		} = this.props

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
					{(primaryEducation || []).map((v, i) => (
						<Marker
							key={i}
							visible={zoom >= zoomLevelTolerance && primaryEducationVisible}
							position={{
								lat: v[0].geo_location.coordinates[1],
								lng: v[0].geo_location.coordinates[0]
							}}
							icon={educationMarkerIcon}
						/>
					))}
					{(secondaryEducation || []).map((v, i) => (
						<Marker
							key={i}
							visible={zoom >= zoomLevelTolerance && secondaryEducationVisible}
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
}

const mapStateToProps = (state: ReduxState) => ({
	zoom: state.application.zoom,
	primaryEducation: state.travelTime.primaryEducation,
	secondaryEducation: state.travelTime.secondaryEducation,
	primaryEducationVisible: state.application.primaryEducationVisible,
	secondaryEducationVisible: state.application.secondaryEducationVisible
})
const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({}, dispatch)

export const Pois = connect<StateProps, DispatchProps, Props, ReduxState>(
	mapStateToProps,
	mapDispatchToProps
)(Component)
