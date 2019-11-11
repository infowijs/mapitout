import React, { ReactNode } from 'react'

import { TransportType } from 'enums'
import { BikeIcon, BusBikeIcon, BusIcon, CarIcon, WalkIcon } from 'icons'

export function getTravelTypeInfo(type: TransportType | undefined) {
	let name!: string
	let icon!: ReactNode

	switch (type) {
		case TransportType.Driving:
			name = 'Driving'
			icon = <CarIcon/>
			break;
		case TransportType.Cycling:
			name = 'Cycling'
			icon = <BikeIcon/>
			break;
		case TransportType.PublicTransport:
			name = 'Public transport'
			icon = <BusIcon/>
			break;
		case TransportType.Cycling_PublicTransport:
			name = 'Public transport & cycling'
			icon = <BusBikeIcon/>
			break;
		case TransportType.Walking:
			name = 'Walking'
			icon = <WalkIcon/>
			break;
		default:
			name = ''
			icon = null
			break;
	}

	return {name, icon}
}
