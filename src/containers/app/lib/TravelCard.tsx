import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'

import { ReduxState } from 'store'
import { ClockIcon, CrossIcon, EditIcon } from 'icons'
import { TravelType } from 'enums'
import { hexColorToRGBA } from 'utils'

const StyledTravelCard = styled.div<{color: string}>`
	position: relative;
	width: 25rem;
	border-radius: 30px;
	overflow: auto;
	// Width of action buttons including padding, this rule makes sure the title ellipses at the right spot.
	padding-right: ${34 + 16 * 2}px;
	box-sizing: border-box;
	background-color: ${(props) => hexColorToRGBA(props.color, .9)};
	color: #fff;
	
	&:not(:last-child) {
		margin-bottom: 16px;
	}
`

const StyledTravelCardInfo = styled.div`
	float: left;
	padding: 25px;
	width: 100%;
	
	h1 {
		margin: 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
`

const StyledTravelCardInfoMeta = styled.div`
	float: left;
`

const StyledTravelCardInfoMetaItem = styled.div`
	float: left;
	
	&:not(:last-child) {
		margin-right: 8px;
	}
	
	* {
		display: inline-block;
		vertical-align: middle;
	}
`

const StyledTravelCardInfoMetaItemIcon = styled.div`
	width: 16px;
	margin-right: 8px;
`

const StyledTravelCardAction = styled.div`
	position: absolute;
	top: 0;
	right: 0;
	padding: 16px;
`

const StyledTravelCardActionItem = styled.div`
	cursor: pointer;
	position: relative;
	width: 32px;
	height: 32px;
	border-radius: 50%;
	background-color: rgba(0, 0, 0, .1);
	
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
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		max-width: 16px;
		max-height: 16px;
	}
	
	&:not(:last-child) {
		margin-bottom: 8px;
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
