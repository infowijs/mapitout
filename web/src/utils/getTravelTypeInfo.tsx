import React, { ReactNode } from 'react'

import { TravelType } from 'enums'
import { BikeIcon, BusBikeIcon, BusIcon, CarIcon, WalkIcon } from 'icons'

export function getTravelTypeInfo(type: TravelType) {
	let name!: string
	let icon!: ReactNode

	switch (type) {
		case TravelType.Driving:
			name = 'Driving'
			icon = <CarIcon/>
			break;
		case TravelType.Cycling:
			name = 'Cycling'
			icon = <BikeIcon/>
			break;
		case TravelType.PublicTransport:
			name = 'Public transport'
			icon = <BusIcon/>
			break;
		case TravelType.PublicTransportAndCycling:
			name = 'Public transport & cycling'
			icon = <BusBikeIcon/>
			break;
		case TravelType.Walking:
			name = 'Walking'
			icon = <WalkIcon/>
			break;
	}

	return {name, icon}
}
