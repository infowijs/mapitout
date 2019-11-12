import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import styled, { css } from 'styled-components'
import CopyToClipboard from 'react-copy-to-clipboard'

import { ReduxState, getTravelTimes, removeTravelTime, purgeTravelTimes, setOverlapState } from 'store'
import { TravelTimeAbstraction } from 'interfaces'
import { AddIcon, InfoIcon, LayersIcon, LinkIcon, LogoIcon } from 'icons'
import { colorList, hexColorToRGBA } from 'utils'
import { shadows } from '../../../constants'

import { TravelCard } from './TravelCard'
import { EditTravelTime } from './EditTravelTime'
import { Loader } from './Loader'
import { Filter } from './Filter'

const StyledUIContainer = styled.main<{menuActive: boolean}>`
	position: absolute;
	top: 0;
	left: 0;
	box-sizing: border-box;
	height: 100%;
	display: flex;
	flex-direction: column;
	pointer-events: none;
	
	@media (max-width: 900px) {
		transition: left 300ms;
		left: ${(props) => props.menuActive ? 0 : '-100%'};
	}
`

const StyledUIContainerInner = styled.div`
	flex: 1;
	display: flex;
    flex-direction: column;

	@media (max-width: 900px) {
		padding-left: 100vw;
	}
`

const StyledUIContainerInnerMainContent = styled.div`
	flex: 1;
	padding: 1rem 1rem 60px;
	display: flex;
	flex-direction: column;
`

const StyledSlogan = styled.h1`
	margin-bottom: 1rem;
	margin-left: .5rem;
`

const StyledUIContainerInnerMainContentInner = styled.div<{isEditing: boolean}>`
	flex: 1 1 auto;
    overflow: auto;
    height: 100px;
    
    ::-webkit-scrollbar {
		display: none;
	}
    
    ${(props) => !props.isEditing && css`
		@media (min-width: 900px) {
			pointer-events: all;
			width: 27rem;
		}
	`}
`

const StyledFilterContainer = styled.div`
	width: 27rem;
	max-width: 100vw;
	box-sizing: border-box;
	
	padding: 0 1rem 0;
`

const StyledLogoContainer = styled.div`
	position: absolute;
	top: 0;
	right: 1rem;
	z-index: 10;
`

const StyledActionContainer = styled.div`
	margin-top: .5rem;
    flex-direction: column;
    align-items: flex-start;
    display: inline-flex;
`

const StyledAction = styled.div<{isDisabled?: boolean}>`
	position: relative;
	cursor: ${(props) => props.isDisabled ? 'default' : 'pointer'};
	transition: 100ms;
	opacity: ${(props) => props.isDisabled ? .5 : 1};
	margin: .75rem 0;
	display: flex;
	flex-direction: row;
	align-items: center;
	z-index: 0;
	
	pointer-events: auto;
	
	@media (max-width: 900px) {
		margin: .25rem 0;
		
		p {
			display: none;
		}
	}
	
	${(props) => !props.isDisabled && css`
		:before {
			content: '';
			position: absolute;
			top: 10%;
			height: 80%;
			left: 1.25rem;
			background-color: rgba(255, 255, 255, 0.75);
			border-radius: 99px;
			transition: 200ms;
			width: 0;
			z-index: -1;
		}
		
		@media (min-width: 900px) {
			:hover:before {
				width: 100%;
			}
		}
	`};
`

const StyledActionIcon = styled.div<{isDisabled?: boolean, isActive?: boolean}>`
	border-radius: 99px;
	background-color: ${(props) => props.isActive ? '#000' : '#fff'};
	color: ${(props) => props.isActive ? '#fff' : '#000'};
	margin-right: .5em;
	${shadows.normal};
	width: 2.5rem;
	height: 2.5rem;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: 100ms;
	
	${(props) => !props.isDisabled && css`
		${StyledAction}:hover & {
			transform: scale(1.1);
		}
	`}
`

const StyledCopyNotification = styled.div`
	padding: .125rem .25rem;
	border-radius: 99px;
	position: absolute;
	bottom: -1rem;
	animation-name: anim;
	animation-duration: 3000ms;
	white-space: nowrap;
	background-color: #fff;
	
	@media (max-width: 900px) {
		bottom: 50%;
		transform: translateY(50%);
	}
	
	p {
		font-size: .625rem !important;
	}

	@keyframes anim {
		0% {
			left: 2rem;
			opacity: 0;
		}
		10% {
			left: 3rem;
			opacity: 1;
		}
		90% {
			left: 3rem;
			opacity: .75;
		}
		100% {
			left: 2rem;
			opacity: 0;
		}
	}
`

const StyledLoaderContainer = styled.div`
	margin: 1rem 0 1rem 1rem;
`

const sharedWrapperVisibilityAnimation = css<{visible: boolean}>`
	pointer-events: ${(props) => props.visible ? 'auto' : 'none'};
	transition: 500ms;
	
	& > * {
		transition: 500ms;
	}
	
	${(props) => props.visible ? css`
		max-height: 200px;
		
		& > * {
			opacity: 1;
		}
	` : css`
		max-height: 0;
		
		& > * {
		opacity: 0;
		}
	`}
	}
`



const StyledCardContainer = styled.div<{visible: boolean}>`	
	${sharedWrapperVisibilityAnimation};
	
	width: 25rem;
	max-width: 100vw;
`

const StyledEditWrapper = styled.div<{visible: boolean}>`
	${sharedWrapperVisibilityAnimation};
	
	@media (max-width: 900px) {
		position: absolute;
		width: 100vw;
		top: 0;
		left: 0;
		padding: 5rem 1.5rem 0;
    	box-sizing: border-box;
    	z-index: 0;
    	
    	:before {
    		content: '';
    		position: absolute;
    		top: 0;
    		left: 0;
    		width: 100%;
    		height: 100%;
    		background: linear-gradient(to bottom, #D9F0F3 0%, #D9F0F3 15%, ${hexColorToRGBA('#D9F0F3', 0)} 50%);
    		z-index: -1;
    	}
	}
`

const StyledEntryTravelTimeContainer = styled.div`
	position: absolute;
	left: 0;
	width: 100%;
	
	@media (min-width: 900px) {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 4rem;
	}
	
	@media (max-width: 900px) {
		padding: 6rem 1rem 0;
		box-sizing: border-box;
		z-index: 0;
		
		:before {
    		content: '';
    		position: absolute;
    		top: 0;
    		left: 0;
    		width: 100%;
    		height: 100%;
    		background: linear-gradient(to bottom, #D9F0F3 0%, #D9F0F3 15%, ${hexColorToRGBA('#D9F0F3', 0)} 50%);
    		z-index: -1;
    	}
	}
`

const StyledOnboardingTooltipContainer = styled.div`
	width: 100%;
	position: absolute;
	bottom: 0;
	left: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	pointer-events: none;
`

const StyledOnboardingTooltip = styled.div`
	display: flex;
	margin: 0 1rem 2rem;
	background-color: rgba(0, 0, 0, .6);
	border-radius: 99px;
	min-height: 40px;
	flex-direction: row;
	align-items: center;
	color: white;
	padding: 0 .75rem;
	
	@media (max-width: 900px) {
		padding: .25rem .75rem;
	}
	
	& > *:first-child {
		min-width: 1rem;
		margin-right: .5rem;
	}
`

interface StateProps {
	loading: ReduxState['travelTime']['loading']
	travelTimes: ReduxState['travelTime']['travelTimes']
	overlap: ReduxState['travelTime']['overlap']
	overlapVisible: ReduxState['application']['overlapVisible']
	newTravelTimeDetails: ReduxState['application']['newTravelTimeDetails']
}
interface DispatchProps {
	getTravelTimes: typeof getTravelTimes
	removeTravelTime: typeof removeTravelTime
	purgeTravelTimes: typeof purgeTravelTimes
	setOverlapState: typeof setOverlapState
}
interface Props {}
type PropsUnion = StateProps & DispatchProps & Props

interface State {
	isCurrentlyAddingNewTravelTime: boolean
	currentTravelTimeEditing: string | null
	currentTravelTimeEditSaving: string | null
	justCopied: boolean
}

export class Component extends React.Component<PropsUnion, State> {
	public readonly state: State = {
		isCurrentlyAddingNewTravelTime: false,
		currentTravelTimeEditing: null,
		currentTravelTimeEditSaving: null,
		justCopied: false
	}
	public addressFieldRef = React.createRef<any>()
	public newEditTravelTimeRef = React.createRef<typeof EditTravelTime.prototype>()
	public scrollableTravelTimesContainer = React.createRef<HTMLDivElement>()

	public componentDidUpdate(prevProps: Readonly<PropsUnion>, prevState: Readonly<State>, snapshot?: any): void {
		if (this.props.newTravelTimeDetails !== prevProps.newTravelTimeDetails) {
			this.setState({isCurrentlyAddingNewTravelTime: true})

			if (this.scrollableTravelTimesContainer.current) {
				this.scrollableTravelTimesContainer.current.scrollBy({behavior: 'smooth', top: 2000})
			}

			if (this.newEditTravelTimeRef.current) {
				this.newEditTravelTimeRef.current.updateValues(this.props.newTravelTimeDetails)
			}
		}
		if (this.state.currentTravelTimeEditSaving) {
			this.setState({
				currentTravelTimeEditSaving: null
			})
		}
	}

	public render() {
		if (!this.props.travelTimes || this.props.travelTimes.length === 0) {
			return (
				<>
					<StyledLogoContainer>
						<LogoIcon/>
					</StyledLogoContainer>
					<StyledEntryTravelTimeContainer>
						{this.props.loading ? <Loader/> : <EditTravelTime
							ref={this.newEditTravelTimeRef}
							color={colorList[0]}
							onFinish={(v: TravelTimeAbstraction) => {this.addTravelTime(v)}}
							onCancel={() => null}
						/>}
					</StyledEntryTravelTimeContainer>
					<StyledOnboardingTooltipContainer>
						<StyledOnboardingTooltip>
							<InfoIcon/>
							<p>Click anywhere on the map to add a location</p>
						</StyledOnboardingTooltip>
					</StyledOnboardingTooltipContainer>
				</>
			)
		}

		return (
			<>
				<StyledLogoContainer>
					<LogoIcon/>
				</StyledLogoContainer>
				<StyledUIContainer menuActive={!!this.state.currentTravelTimeEditing || this.state.isCurrentlyAddingNewTravelTime}>
					<StyledUIContainerInner>
						<StyledUIContainerInnerMainContent>
							<StyledSlogan>How far would I live from</StyledSlogan>
							<StyledUIContainerInnerMainContentInner
								ref={this.scrollableTravelTimesContainer}
								isEditing={!!this.state.currentTravelTimeEditing || this.state.isCurrentlyAddingNewTravelTime}
							>
								{this.renderTravelTimes()}
								{this.renderActiveNew()}
								{this.renderLoader()}
							</StyledUIContainerInnerMainContentInner>
							{this.renderMapActions()}
						</StyledUIContainerInnerMainContent>
						<StyledFilterContainer>
							<Filter/>
						</StyledFilterContainer>
					</StyledUIContainerInner>
				</StyledUIContainer>
			</>
		)
	}

	private renderTravelTimes() {
		return (
			<>
				{this.props.travelTimes && this.props.travelTimes.map((travelTime, i) => (
					<React.Fragment key={travelTime.res.search_id}>
						<StyledCardContainer
							visible={travelTime.res.search_id !== this.state.currentTravelTimeEditing}
							onClick={() => window.innerWidth <= 900 && this.edit(travelTime.res.search_id)}
						>
							<TravelCard
								color={colorList[i]}
								onDelete={() => this.removeTravelTime(travelTime.res.search_id)}
								onEdit={() => this.edit(travelTime.res.search_id)}
								{...travelTime}
							/>
						</StyledCardContainer>
						<StyledEditWrapper
							visible={travelTime.res.search_id === this.state.currentTravelTimeEditing}
						>
							<EditTravelTime
								color={colorList[i]}
								onFinish={(v: TravelTimeAbstraction) => {
									this.save(travelTime.res.search_id, v)

									if (this.newEditTravelTimeRef.current) {
										this.newEditTravelTimeRef.current.updateValues(null)
									}
								}}
								onCancel={() => this.setState({
									currentTravelTimeEditing: null,
									currentTravelTimeEditSaving: null
								})}
								onDelete={() => this.removeTravelTime(travelTime.res.search_id)}
								{...travelTime}
							/>
						</StyledEditWrapper>
					</React.Fragment>
				))}
			</>
		)
	}

	private renderLoader() {
		if (!this.props.loading) return null

		return (
			<StyledLoaderContainer>
				<Loader/>
			</StyledLoaderContainer>
		)
	}

	private renderMapActions() {
		return (
			<StyledActionContainer>
				<StyledAction
					isDisabled={!!(this.props.travelTimes && this.props.travelTimes.length >= 6)}
					onClick={() => {
						if (!(this.props.travelTimes && this.props.travelTimes.length >= 6)) {
							this.setState({
								isCurrentlyAddingNewTravelTime: true,
								currentTravelTimeEditing: null,
								currentTravelTimeEditSaving: null
							})
						}
						if (this.scrollableTravelTimesContainer.current) {
							this.scrollableTravelTimesContainer.current.scrollBy({behavior: 'smooth', top: 2000})
						}
					}}
				>
					<StyledActionIcon>
						<AddIcon/>
					</StyledActionIcon>
					<p>Add new location</p>
				</StyledAction>
				<StyledAction
					isDisabled={!this.isOverlapAvailable()}
					onClick={() => this.isOverlapAvailable()
						&& this.props.setOverlapState(!this.props.overlapVisible)}
				>
					<StyledActionIcon
						isDisabled={!this.isOverlapAvailable()}
						isActive={this.props.overlapVisible}
					>
						<LayersIcon/>
					</StyledActionIcon>
					<p>{
						this.isOverlapAvailable()
							? (this.props.overlapVisible
								? 'Back to normal'
								: 'Show overlapping area')
							: 'No overlapping area'
					}</p>
				</StyledAction>
				<CopyToClipboard text={window.location.href} onCopy={this.handleCopy}>
					<StyledAction>
						<StyledActionIcon>
							<LinkIcon/>
						</StyledActionIcon>
						<p>{this.props.travelTimes && this.props.travelTimes.length > 1
							? 'Share these locations'
							: 'Share this location'}</p>
						{this.state.justCopied && (
							<StyledCopyNotification>
								<p className="label">Copied to clipboard</p>
							</StyledCopyNotification>
						)}
					</StyledAction>
				</CopyToClipboard>
			</StyledActionContainer>
		)
	}

	private renderActiveNew() {
		return (
			<StyledEditWrapper visible={this.state.isCurrentlyAddingNewTravelTime}>
				<EditTravelTime
					ref={this.newEditTravelTimeRef}
					new={true}
					color={colorList[(this.props.travelTimes && this.props.travelTimes.length) || 0]}
					onFinish={(v: TravelTimeAbstraction) => {
						this.addTravelTime(v)

						if (this.newEditTravelTimeRef.current) {
							this.newEditTravelTimeRef.current.updateValues(null)
						}
					}}
					onCancel={() => this.setState({
						isCurrentlyAddingNewTravelTime: false
					})}
				/>
			</StyledEditWrapper>
		)
	}

	private edit = (id: string) => {
		this.setState({
			isCurrentlyAddingNewTravelTime: false,
			currentTravelTimeEditing: id
		}, () => this.setFocus())
	}

	private setFocus() {
		if (this.addressFieldRef.current) {
			this.addressFieldRef.current.focus()
		} else {
			setTimeout(() => this.setFocus(), 50)
		}
	}

	private save = (id: string, travelTime: TravelTimeAbstraction) => {
		const data: TravelTimeAbstraction[] = (this.props.travelTimes || []).map((v) => {
			return id === v.res.search_id ? travelTime : {
				title: v.title,
				location: {
					title: v.location.title,
					lat: v.location.lat,
					lng: v.location.lng
				},
				duration: v.duration,
				transport: v.transport
			}
		})

		this.props.getTravelTimes(data)
		this.setState({
			currentTravelTimeEditSaving: id,
			currentTravelTimeEditing: null
		})
	}

	private addTravelTime = (travelTime: TravelTimeAbstraction) => {
		const currentTravelTimes = this.props.travelTimes || []
		this.props.getTravelTimes([
			...currentTravelTimes,
			travelTime
		])
		this.setState({
			isCurrentlyAddingNewTravelTime: false
		})
	}

	private removeTravelTime = (id: string) => {
		const currentTravelTimes = this.props.travelTimes || []
		const newTravelTimes = currentTravelTimes.filter((travelTime) => travelTime.res.search_id !== id)

		if (newTravelTimes.length === 0) {
			this.props.purgeTravelTimes()
			return
		}

		this.props.removeTravelTime(id)
		this.props.getTravelTimes([
			...newTravelTimes
		])
	}

	private handleCopy = () => {
		this.setState({
			justCopied: true
		}, () => setTimeout(() => this.setState({
			justCopied: false
		}), 3000))
	}

	private isOverlapAvailable(): boolean {
		if (!this.props.overlap) return false
		if (!this.props.travelTimes) return false

		return this.props.overlap.shapes[0].shell.length > 0 && this.props.travelTimes.length > 1
	}
}

const mapStateToProps = (state: ReduxState) => ({
	loading: state.travelTime.loading,
	travelTimes: state.travelTime.travelTimes,
	overlap: state.travelTime.overlap,
	overlapVisible: state.application.overlapVisible,
	newTravelTimeDetails: state.application.newTravelTimeDetails
})

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
	getTravelTimes,
	removeTravelTime,
	purgeTravelTimes,
	setOverlapState
}, dispatch)

export const InteractiveOverlay = connect<StateProps, DispatchProps, Props, ReduxState>(
	mapStateToProps,
	mapDispatchToProps
)(Component)
