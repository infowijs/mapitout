import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'

import { ReduxState } from 'store'
import { ClockIcon, CrossIcon, EditIcon } from 'icons'
import { TravelType } from 'enums'
import { getTravelTypeInfo, hexColorToRGBA } from 'utils'
import { shadows } from '../../../constants'

const StyledTravelCard = styled.div<{color: string}>`
	border-radius: 2rem;
	
	background-color: ${(props) => hexColorToRGBA(props.color, .9)};
	color: #fff;
	${shadows.normal};
	
	@media (min-width: 900px) {
		display: flex;
		flex-direction: row;
		margin-bottom: 16px;
	}
	
	@media (max-width: 900px) {
		height: 2.5rem;
		width: 2.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: .5rem;
	}
`

const StyledTravelCardInfo = styled.div`
	@media (min-width: 900px) {
		flex: 1;
		padding: 25px;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
	
	h1 {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin-bottom: 1rem;
		
		@media (max-width: 900px) {
			display: none;
		}
	}
`

const StyledTravelCardInfoMeta = styled.div`
	@media (min-width: 900px) {
		display: flex;
		flex-direction: row;
	}
`

const StyledTravelCardInfoMetaItem = styled.div`	
	@media (min-width: 900px) {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	
	&:not(:last-child) {
		margin-right: 2rem;
		
		@media (max-width: 900px) {
			display: none;
		}
	}
	@media (max-width: 900px) {
		&:last-child {
			p {
				display: none;
			}
		}
	}
`

const StyledTravelCardInfoMetaItemIcon = styled.div`
	width: 1rem;
	height: 1rem;
	display: flex;
	align-items: center;
	justify-content: center;
	
	@media (min-width: 900px) {
		margin-right: .5rem;
	}
`

const StyledTravelCardAction = styled.div`
	padding: 1rem 1rem 0 0;
	
	@media (max-width: 900px) {
		display: none;
	}
`

const StyledTravelCardActionItem = styled.div`
	cursor: pointer;
	position: relative;
	width: 2rem;
	height: 2rem;
	border-radius: 50%;
	background-color: rgba(0, 0, 0, .1);
	display: flex;
	align-items: center;
	justify-content: center;
	
	:before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		background-color: rgba(0, 0, 0, .1);
		border-radius: 50%;
		width: 100%;
		height: 100%;
		transition: 80ms;
	}
	:hover:before {
		transform: scale(1.25);
	}
	
	svg {
		max-width: 1rem;
		max-height: 1rem;
	}
	
	&:not(:last-child) {
		margin-bottom: .5rem;
	}
`

interface StateProps {}
interface DispatchProps {}
interface Props {
	color: string
	title: string
	duration: number
	transport: TravelType
	onDelete: () => any
	onEdit: () => any
}
type PropsUnion = StateProps & DispatchProps & Props

interface State {}

export class Component extends React.Component<PropsUnion, State> {
	public readonly state: State = {}

	public render() {
		const {color, title, duration, transport, onDelete, onEdit} = this.props
		return (
			<StyledTravelCard color={color}>
				<StyledTravelCardInfo>
					<h1>{title}</h1>
					<StyledTravelCardInfoMeta>
						<StyledTravelCardInfoMetaItem>
							<StyledTravelCardInfoMetaItemIcon>
								<ClockIcon/>
							</StyledTravelCardInfoMetaItemIcon>
							<p className='label'>{duration / 60} minutes</p>
						</StyledTravelCardInfoMetaItem>
						<StyledTravelCardInfoMetaItem>
							<StyledTravelCardInfoMetaItemIcon>
								<ClockIcon/>
							</StyledTravelCardInfoMetaItemIcon>
							<p className='label'>{this.getTravelTypePrettyName(transport)}</p>
						</StyledTravelCardInfoMetaItem>
					</StyledTravelCardInfoMeta>
				</StyledTravelCardInfo>
				<StyledTravelCardAction>
					<StyledTravelCardActionItem onClick={onEdit}>
						<EditIcon/>
					</StyledTravelCardActionItem>
					<StyledTravelCardActionItem onClick={onDelete}>
						<CrossIcon/>
					</StyledTravelCardActionItem>
				</StyledTravelCardAction>
			</StyledTravelCard>
		)
	}

	private getTravelTypePrettyName(type: TravelType): string {
		switch (type) {
			case TravelType.Cycling:
				return 'Cycling'
			case TravelType.Driving:
				return 'Driving'
			case TravelType.PublicTransport:
				return 'Public transport'
			case TravelType.PublicTransportAndCycling:
				return 'Public transport & cycling'
			case TravelType.Walking:
				return 'Walking'
		}
	}
}

const mapStateToProps = (state: ReduxState) => ({})

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({}, dispatch)

export const TravelCard = connect<StateProps, DispatchProps, Props, ReduxState>(
	mapStateToProps,
	mapDispatchToProps
)(Component)
