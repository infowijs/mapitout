import { ActionDispatch } from './reducer'
import { api } from '../../utils'
import {AxiosResponse} from 'axios'
import {POIApiResponse} from '../../interfaces'

export enum ActionType {
	FetchPois = '@@poi/fetch'
}

export function getPois() {
	return async (dispatch: (action: ActionDispatch) => {}) => {
		const [
			primaryEducation,
			secondaryEducation
		] = await Promise.all([
			getEducationPois('Primary education'),
			getEducationPois('Secondary education')
		])

		dispatch({
			type: ActionType.FetchPois,
			data: {
				primaryEducation: primaryEducation.status === 200
				&& !('response' in primaryEducation.data && primaryEducation.data.response === 'No results')
					? primaryEducation.data as POIApiResponse
					: null,
				secondaryEducation: secondaryEducation.status === 200
				&& !('response' in secondaryEducation.data && secondaryEducation.data.response === 'No results')
					? secondaryEducation.data as POIApiResponse
					: null
			}
		})
	}
}

const getEducationPois = (type: 'Primary education' | 'Secondary education') => {
	const bounds = {
		north: 52.5,
		east: 5.35,
		south: 52,
		west: 4.55
	}

	const data = {
		poi_in_polygon: {
			type: 'Feature',
			geometry: {
				type: 'MultiPolygon',
				coordinates: [[[
					[bounds.west, bounds.north],
					[bounds.east, bounds.north],
					[bounds.east, bounds.south],
					[bounds.west, bounds.south]
				]]],
				crs: {
					type: 'name',
					properties: {
						name: 'EPSG:4326'
					}
				}
			}
		},
		poi_by_type: ['School'],
		poi_by_property: [type]
	}
	return api.post<any, AxiosResponse<POIApiResponse | {response: 'No results'}>>('/PoiApi/cmd', data)
}
