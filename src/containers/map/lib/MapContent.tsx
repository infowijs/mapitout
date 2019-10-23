import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import { Marker, Polygon } from 'react-google-maps'
import simplify from 'simplify-js'

import { ReduxState } from 'store'
import { bspline } from 'utils'
import { colors } from '../../../constants'

interface StateProps {
	travelTimes: ReduxState['travelTime']['travelTimes']
}
interface DispatchProps {}
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
			</>
		)
	}

	private renderPolygons() {
		return (
			<>
				{this.props.travelTimes && this.props.travelTimes.map((travelTime, i) => travelTime.res.shapes.map((shape, j) => (
					<Polygon
						key={`${travelTime.res.search_id}:${j}`}
						options={{
							strokeColor: colors[i],
							fillColor: colors[i],
							strokeOpacity: 0.50,
							strokeWeight: 2,
							fillOpacity: 0.25
						}}
						paths={[
							this.getSmoothShape(shape.shell),
							...shape.holes.map((hole) => this.getSmoothShape(hole))
						]}
					/>
				)))}
			</>
		)
	}

	private renderMarkers() {
		return (
			<></>
		)
	}

	private getSmoothShape(coordinates: Array<{lat: number, lng: number}>) {
		const simplifiedShape = simplify(coordinates.map((coordinate) => ({
			x: coordinate.lat,
			y: coordinate.lng
		})), .005, false)

		return bspline(
			simplifiedShape.map((coord: any) => coord.x),
			simplifiedShape.map((coord: any) => coord.y),
			0.05
		)
	}
}

const mapStateToProps = (state: ReduxState) => ({
	travelTimes: state.travelTime.travelTimes
})
const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({}, dispatch)

export const MapContent = connect<StateProps, DispatchProps, Props, ReduxState>(
	mapStateToProps,
	mapDispatchToProps
)(Component)
