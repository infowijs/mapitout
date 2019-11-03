import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import { withGoogleMap, GoogleMap } from 'react-google-maps'
import styled from 'styled-components'

import { ZoomInIcon, ZoomOutIcon } from 'icons'
import { ReduxState, setZoomLevel, setTooltip } from 'store'

import { googleMapsStyles } from '../../constants'
import { Markers, Pois, Polygons, Tooltip } from './lib'

const StyledZoomControl = styled.div`
	position: absolute;
	
	@media (min-width: 900px) {
		bottom: 1.5rem;
		right: 1.5rem;
	}
	
	@media (max-width: 900px) {
		bottom: 4.75rem;
		right: 1rem;
	}
	
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
interface DispatchProps {
	setZoomLevel: typeof setZoomLevel
	setTooltip: typeof setTooltip
}
interface Props {}
type PropsUnion = StateProps & DispatchProps & Props

interface State {}

export class Component extends React.Component<PropsUnion, State> {
	public readonly state: State = {}
	public mapRef = React.createRef<GoogleMap>()

	public render() {
		const MapFactory = withGoogleMap((props: any) =>
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
				onZoomChanged={() => this.props.setZoomLevel(Math.round(this.mapRef.current!.getZoom()))}
				onClick={(e) => {
					const location = {
						lat: e.latLng.lat(),
						lng: e.latLng.lng()
					}
					const geocoder = new google.maps.Geocoder()
					geocoder.geocode({location}, (results, status) => {
						const address = (results && results.length > 0 && results[0].address_components) || []

						const city = address.filter((a) => a.types.indexOf('locality') !== -1)[0]
						const streetName = address.filter((a) => a.types.indexOf('route') !== -1)[0]
						const number = address.filter((a) => a.types.indexOf('street_number') !== -1)[0]

						const addressString = ((streetName
							? streetName.short_name
							: '')
						+ (number
							? ' ' + number.short_name
							: '')
						+ (city
							? ', ' + city.short_name
							: '')) || 'Somewhere on a boat'

						this.props.setTooltip({
							location,
							title: addressString
						})
					})
				}}
			>
				{this.renderZoomControls()}
				<Markers/>
				<Pois/>
				<Polygons/>
				<Tooltip/>
			</GoogleMap>
		)

		return (
			<MapFactory
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

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
	setZoomLevel,
	setTooltip
}, dispatch)

export const Map = connect<StateProps, DispatchProps, Props, ReduxState>(
	mapStateToProps,
	mapDispatchToProps
)(Component)
