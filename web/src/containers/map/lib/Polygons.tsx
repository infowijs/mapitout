import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import { Polygon } from 'react-google-maps'
import simplify from 'simplify-js'

import { ReduxState, getTravelTimes } from 'store'
import { bspline, colorList } from 'utils'

interface StateProps {
	travelTimes: ReduxState['travelTime']['travelTimes']
	overlap: ReduxState['travelTime']['overlap']
	zoom: ReduxState['application']['zoom']
	overlapVisible: ReduxState['application']['overlapVisible']
}
interface DispatchProps {
	getTravelTimes: typeof getTravelTimes
}
interface Props {}
type PropsUnion = StateProps & DispatchProps & Props

type Coordinate = {lat: number, lng: number}
interface State {
	coordinates: Array<[Coordinate[], Coordinate[]]>
}

// Outer range clamps for zoom level
const range = [7, 12]
// Minimum amount of points within a polygon based on the ranges described in `range`
const minimumPolyRange = [20, 2]
export class Component extends React.Component<PropsUnion, State> {
	public readonly state: State = {
		coordinates: [[[], []]]
	}

	public shouldComponentUpdate(nextProps: Readonly<PropsUnion>, nextState: Readonly<State>, nextContext: any): boolean {
		if (
			this.props.travelTimes !== nextProps.travelTimes
			|| this.props.overlap !== nextProps.overlap
			|| this.props.overlapVisible !== nextProps.overlapVisible
		) {
			return true
		}

		return !((this.props.zoom <= range[0] && nextProps.zoom <= range[0])
			|| (this.props.zoom >= range[1] && nextProps.zoom >= range[1]))
	}

	public render() {
		const {overlap, overlapVisible, travelTimes} = this.props

		return (
			<>
				{overlap && overlap.shapes.map((shape, i) =>
					 this.renderPolygon(
						`overlap:${i}`,
						'#000',
						shape,
						overlapVisible
					)
				)}
				{travelTimes && travelTimes.map((travelTime, i) =>
					travelTime.res.shapes.map((shape, j) =>
						this.renderPolygon(
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
		const progress = Math.max(Math.min(1 - (this.props.zoom - range[0]) / (range[1] - range[0]), 1), 0)

		if (shape.shell.length <= (minimumPolyRange[1] - minimumPolyRange[0]) * (1 - progress) + minimumPolyRange[0]) return null

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
					this.getSmoothShape(shape.shell, progress),
					...shape.holes.filter((hole) => hole.length > 15).map((hole) => this.getSmoothShape(hole, progress))
				]}
				visible={visible}
			/>
		)
	}

	private getSmoothShape(coordinates: Array<{lat: number, lng: number}>, progress: number) {
		// return coordinates
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
}

const mapStateToProps = (state: ReduxState) => ({
	travelTimes: state.travelTime.travelTimes,
	overlap: state.travelTime.overlap,
	zoom: state.application.zoom,
	overlapVisible: state.application.overlapVisible
})
const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
	getTravelTimes
}, dispatch)

export const Polygons = connect<StateProps, DispatchProps, Props, ReduxState>(
	mapStateToProps,
	mapDispatchToProps
)(Component)
