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

interface StateProps {
	travelTimes: ReduxState['travelTime']['travelTimes']
	tooltip: ReduxState['application']['tooltip']
}
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

	public setTooltipTimeout: ReturnType<typeof setTimeout> | null = null

	public shouldComponentUpdate(nextProps: Readonly<PropsUnion>, nextState: Readonly<State>, nextContext: any): boolean {
		if (this.mapRef.current && nextProps.travelTimes && nextProps.travelTimes !== this.props.travelTimes) {
			let north = 0
			let east = 0
			let south = 99
			let west = 99

			for (const coordinate of nextProps.travelTimes.map((v) => v.res.shapes.map((s) => s.shell)).flat(2)) {
				north = Math.max(north, coordinate.lat)
				east = Math.max(east, coordinate.lng)
				south = Math.min(south, coordinate.lat)
				west = Math.min(west, coordinate.lng)
			}

			const zoomLevel = Math.min(getBoundsZoomLevel(
				new google.maps.LatLngBounds(
				{lat: south, lng: west},
				{lat: north, lng: east}
				),
				{
					width: window.innerWidth,
					height: window.innerHeight
				}), 12)

			if (this.mapRef.current.getZoom() !== zoomLevel) {
				this.zoomTo(this.mapRef.current.getZoom(), zoomLevel, this.mapRef.current.getZoom() > zoomLevel ? 'out' : 'in')
			}

			this.mapRef.current.panTo({
				lat: (north + south) / 2,
				lng: (east + west) / 2
			})
		}

		return false
	}

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
				onDblClick={() => this.setTooltipTimeout && clearTimeout(this.setTooltipTimeout)}
				onClick={(e) => {
					if (this.props.tooltip) {
						this.setTooltipTimeout = setTimeout(() => {
							this.props.setTooltip(null)
						}, 250)
					} else {
						this.setTooltipTimeout = setTimeout(() => {
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

								const title = ((streetName
									? streetName.short_name
									: '')
									+ (number
										? ' ' + number.short_name
										: '')
									+ (city
										? ', ' + city.short_name
										: '')) || 'Somewhere on a boat'

								this.props.setTooltip({
									title,
									lat: location.lat,
									lng: location.lng
								})
							})
						}, 250)
					}
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

function getBoundsZoomLevel(bounds: google.maps.LatLngBounds, mapDim: {width: number, height: number}): number {
	const WORLD_DIM = { height: 256, width: 256 };
	const ZOOM_MAX = 21;

	function latRad(lat: number) {
		const sin = Math.sin(lat * Math.PI / 180);
		const radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
		return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
	}

	function zoom(mapPx: number, worldPx: number, fraction: number) {
		return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
	}

	const ne = bounds.getNorthEast();
	const sw = bounds.getSouthWest();

	const latFraction = (latRad(ne.lat()) - latRad(sw.lat())) / Math.PI;

	const lngDiff = ne.lng() - sw.lng();
	const lngFraction = ((lngDiff < 0) ? (lngDiff + 360) : lngDiff) / 360;

	const latZoom = zoom(mapDim.height, WORLD_DIM.height, latFraction);
	const lngZoom = zoom(mapDim.width, WORLD_DIM.width, lngFraction);

	return Math.min(latZoom, lngZoom, ZOOM_MAX);
}

const mapStateToProps = (state: ReduxState) => ({
	travelTimes: state.travelTime.travelTimes,
	tooltip: state.application.tooltip
})

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
	setZoomLevel,
	setTooltip
}, dispatch)

export const Map = connect<StateProps, DispatchProps, Props, ReduxState>(
	mapStateToProps,
	mapDispatchToProps
)(Component)
