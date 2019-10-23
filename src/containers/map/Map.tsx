import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import { withScriptjs, withGoogleMap, GoogleMap } from 'react-google-maps'
import styled from 'styled-components'

import { ZoomInIcon, ZoomOutIcon } from 'icons'
import { ReduxState } from 'store'

import { googleMapsStyles } from '../../constants'
import { MapContent } from './lib'

const StyledZoomControl = styled.div`
	position: absolute;
	bottom: 25px;
	right: 50px;
	
	background: #fff;
	border-radius: 3px;
	padding: 10px;
	
	& > *:first-child {
		padding-bottom: 5px;
	}
`

const StyledZoomControlButton = styled.div`
	cursor: pointer;
	width: 30px;
`

interface StateProps {}
interface DispatchProps {}
interface Props {}
type PropsUnion = StateProps & DispatchProps & Props

interface State {}

export class Component extends React.Component<PropsUnion, State> {
	public readonly state: State = {}
	public mapRef = React.createRef<GoogleMap>()

	public render() {
		const MapFactory = withScriptjs(withGoogleMap((props: any) =>
			<GoogleMap
				ref={this.mapRef}
				defaultZoom={10}
				defaultCenter={{
					lat: 52.3645568,
					lng: 4.8958031
				}}
				defaultOptions={{
					streetViewControl: false,
					scaleControl: false,
					mapTypeControl: false,
					zoomControl: false,
					rotateControl: false,
					fullscreenControl: false,
					disableDefaultUI: true,
					styles: googleMapsStyles
				}}
			>
				{this.renderZoomControls()}
				<MapContent/>
			</GoogleMap>
		))

		return (
			<MapFactory
				googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_TOKEN}&v=3.exp&libraries=geometry,drawing,places`}
				loadingElement={<div/>}
				containerElement={<div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }} />}
				mapElement={<div style={{ height: `100%` }} />}
			/>
		)
	}

	private renderZoomControls() {
		return (
			<StyledZoomControl>
				<StyledZoomControlButton onClick={() => this.zoom('in')}>
					<ZoomInIcon/>
				</StyledZoomControlButton>
				<StyledZoomControlButton onClick={() => this.zoom('out')}>
					<ZoomOutIcon/>
				</StyledZoomControlButton>
			</StyledZoomControl>
		)
	}

	private zoom = (zoomDirection: 'in' | 'out') => {
		if (!this.mapRef.current) return
		const currentZoom = this.mapRef.current.getZoom()
		if (currentZoom < 7 && currentZoom > 15) return
		this.zoomTo(currentZoom, zoomDirection === 'in' ? currentZoom + 1 : currentZoom - 1, zoomDirection)
	}

	private zoomTo = (currentZoom: number, endStop: number, zoomDirection: 'in' | 'out') => {
		if (
			!this.mapRef.current ||
			(zoomDirection === 'in' && currentZoom >= endStop) ||
			(zoomDirection === 'out' && currentZoom <= endStop)
		) return


		const nextZoom = Math.round((currentZoom + (zoomDirection === 'in'
			? + 0.2
			: - 0.2)) * 10) / 10

		this.mapRef.current.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.setZoom(nextZoom)

		setTimeout(() => {
			this.zoomTo(nextZoom, endStop, zoomDirection)
		}, 25)
	}
}

const mapStateToProps = (state: ReduxState) => ({})

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({}, dispatch)

export const Map = connect<StateProps, DispatchProps, Props, ReduxState>(
	mapStateToProps,
	mapDispatchToProps
)(Component)
