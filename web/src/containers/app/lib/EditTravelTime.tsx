import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import styled, { css } from 'styled-components'
import Select from 'react-select'

import { ReduxState } from 'store'
import { TravelTimeAbstraction } from 'interfaces'
import { TransportType } from 'enums'
import { getTravelTypeInfo, hexColorToRGBA } from 'utils'
import { DropdownIcon, GoIcon, CrossIcon } from 'icons'
import { shadows } from '../../../constants'

// Component container styling
const StyledContainer = styled.div`	
	@media (min-width: 900px) {
		display: flex;
		flex-direction: row;
		background-color: #fff;
		border-radius: 99px;
		padding-left: 1rem;
		height: 60px;
		align-items: center;
		${shadows.normal}
	}
	@media (max-width: 900px) {
		display: flex;
		flex-direction: column;
	}
`

// Title wrapper
const StyledTitle = styled.div`
	@media (min-width: 900px) {
		white-space: nowrap;
		display: flex;
		align-items: flex-end;
		height: 1.5rem;
		margin-bottom: 2px;
		margin-right: 1rem;
    }
    @media (max-width: 900px) {
    	text-align: center;
    	margin-bottom: 2rem;
    	font-size: 1.25rem;
    }
`

// Wrapper for the input fields
const StyledSegment = styled.div<{withoutRightMargin?: boolean}>`
	display: flex;
	flex-direction: column;
	
	@media (min-width: 900px) {
		${(props) => !props.withoutRightMargin && css`
			margin-right: 1rem;
		`}
	}
	@media (max-width: 900px) {
    	padding: 1rem 1.5rem;
    	border-radius: 99px;
    	background: #fff;
    	margin-bottom: .5rem;
    }
`

// A colored label
const StyledLabel = styled.label<{color: string}>`
	color: ${(props) => props.color};
`

/*
 * Styling wrapper for the `react-select` package, contains duplicate styling rules from:
 * 	- `StyledAddressInput`
 * 	- `StyledAutocompleteDropdownContainer`
 * 	- `StyledAutocompleteSuggestion`
 * 	merging these rules would mean a lot of overhead in parameter usage (minor differences)
 */
const StyledSelect = styled(Select)<{color: string, minWidth: number}>`
	.react-select {
		position: relative;
		
		&__control {
			cursor: pointer;
			display: flex;
			flex-direction: row;
			background: #fff;
			min-width: ${(props) => props.minWidth}px;
			height: 1.5rem;
			
			@media (min-width: 900px) {
				border-bottom: 2px solid #d8d8d8;
				
				&--is-focused, &--menu-is-open {
					border-bottom: 3px solid #d8d8d8;
					// Fixes the height difference created by the focus effect -> prevents elements from jumping within the layout
					margin-bottom: -1px;
				}
			}
		}
		&__value-container {
			padding-left: 0;
			padding-right: 0;
		}
		&__single-value {
			margin: 0;
		}
		&__menu {
			position: absolute;
			top: 100%;
			min-width: 300px;
			margin-top: 1rem;
			${shadows.normal};
			border-radius: 10px;
			background-color: #fff;
			overflow: hidden;
			z-index: 10;
		}
		&__menu-list {
			padding: 0;
		}
		&__option {
			position: relative;
			cursor: pointer;
			transition: background-color 80ms;
			padding: 10px 5px;
			overflow: auto;
			
			:before {
				content: '';
				position: absolute;
				left: 0;
				top: 0;
				height: 100%;
				width: 0;
				background-color: ${(props) => props.color}
			}
			&--is-focused, &--is-selected {					
				:before {
					width: 2px;
				}
			}
			
			&--is-focused {
				background: ${(props) => `linear-gradient(to right,
					${hexColorToRGBA(props.color, 0.25)},
					${hexColorToRGBA(props.color, 0.1)}
					)`};
			}
			
			&--is-selected {
				color: inherit;
				background: ${(props) => `linear-gradient(to right,
					${hexColorToRGBA(props.color, 0.4)},
					${hexColorToRGBA(props.color, 0.2)}
					)`};
			}
		}
	}
`

// Styling for the autocomplete container used with the `react-places-autocomplete` package
const StyledAutocompleteContainer = styled.div`
	position: relative;
`

// Styling for the input field used with the `react-places-autocomplete` package
const StyledAddressInput = styled.input`
	padding: 0;
	height: 1.5rem;
	outline: none;
	border: none;
	
	@media (min-width: 900px) {
		width: 200px;
		border-bottom: 2px solid #d8d8d8;
		
		:focus {
			border-bottom: 3px solid #d8d8d8;
			// Fixes the height difference created by the focus effect -> prevents elements from jumping within the layout
			margin-bottom: -1px;
		}
	}
`

// Styling for the autocomplete dropdown container used with the `react-places-autocomplete` package
const StyledAutocompleteDropdownContainer = styled.div`
	position: absolute;
	top: 100%;
	min-width: 300px;
	margin-top: 1rem;
	${shadows.normal};
	border-radius: 10px;
	background-color: #fff;
	overflow: hidden;
	z-index: 10;
`

// Styling for the loader used with the `react-places-autocomplete` package
const StyledLoader = styled.div`
	padding: 10px;
`

// Styling for the autocomplete dropdown item used with the `react-places-autocomplete` package
const StyledAutocompleteSuggestion = styled.div<{active: boolean, color: string}>`
	position: relative;
	cursor: pointer;
	transition: background-color 80ms;
	padding: 10px 5px;
	overflow: auto;
	
	:before {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		width: 0;
		background-color: ${(props) => props.color}
	}
	${(props) => props.active && css`
		background: linear-gradient(to right,
			${hexColorToRGBA(props.color, 0.25)},
			${hexColorToRGBA(props.color, 0.1)}
			);
			
		:before {
			width: 2px;
		}
	`};
`

// Container for the actions
const StyledActionContainer = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
`

// Single action
const StyledActionButton = styled.div<{color: string, isDisabled?: boolean, onlyVisibleOnMobile?: boolean}>`
	${(props) => props.onlyVisibleOnMobile && css`
		@media (min-width: 900px) {
			display: none;
		}
	`};
	cursor: ${(props) => props.isDisabled ? 'default' : 'pointer'};
	position: relative;
	background-color: ${(props) => props.color};
	opacity: ${(props) => props.isDisabled ? .5 : 1};
	border-radius: 99px;
	height: 44px;
	width: 44px;
	margin: 8px;
	color: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: 100ms;
	z-index: 0;
	
	${(props) => !props.isDisabled && css`
		:before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			border-radius: 99px;
			background-color: ${hexColorToRGBA(props.color, .5)};
			transition: 100ms;
			z-index: -1;
		}
		:hover:before {
			transform: scale(1.2);
		}
	`};
`

// Container for the dropdown icon, used instead of the dropdown separator
const StyledDropdownIconContainer = styled.div`
	width: 1rem;
	height: 1rem;
	display: flex;
	align-items: center;
	justify-content: center;
`

const StyledCancelButtonContainer = styled.div`
	@media (min-width: 900px) {
		display: inline-block;
	}
	@media (max-width: 900px) {
		text-align: center;
	}
`

// Cancel button styles
const StyledCancelButton = styled.p`
	cursor: pointer;
	margin: 1rem;
	color: rgba(0, 0, 0, .25);

	@media (max-width: 900px) {
		display: inline-block;
		text-align: center;
		color: rgba(0, 0, 0, .5);
		margin: 1rem 0;
		padding: .5rem 1rem;
		background-color: #D9F0F3;
		border-radius: 99px;
	}
`

interface StateProps {}
interface DispatchProps {}
interface Props extends Partial<TravelTimeAbstraction> {
	ref?: React.RefObject<Component>
	color: string;
	onFinish: (v: TravelTimeAbstraction) => any
	onCancel: () => any
	onDelete?: (v: TravelTimeAbstraction) => any
	new?: boolean
}
type PropsUnion = StateProps & DispatchProps & Props

interface State extends Partial<TravelTimeAbstraction> {}

export class Component extends React.Component<PropsUnion, State> {
	constructor(props: PropsUnion) {
		super(props)

		this.state = {
			title: props.title,
			location: props.location,
			duration: props.duration,
			transport: props.transport
		}
	}

	public render() {
		return (
			<>
				<StyledContainer>
					<StyledTitle>
						<p>How far would I live from</p>
					</StyledTitle>
					{this.renderInputAddress()}
					{this.renderInputDuration()}
					{this.renderInputTraveltype()}
					<StyledActionContainer>
						<StyledActionButton
							color={this.props.color}
							isDisabled={!this.isValid(this.state)}
							onClick={() => this.isValid(this.state) && this.props.onFinish(this.state as TravelTimeAbstraction)}
						>
							<GoIcon/>
						</StyledActionButton>
						{this.props.onDelete && <StyledActionButton
							color={this.props.color}
							onClick={() => this.isValid(this.state) && this.props.onDelete!(this.state as TravelTimeAbstraction)}
							onlyVisibleOnMobile={true}
						>
							<CrossIcon/>
						</StyledActionButton>}
					</StyledActionContainer>
				</StyledContainer>
				<StyledCancelButtonContainer>
					<StyledCancelButton className="label" onClick={() => this.props.onCancel()}>
						{this.props.new
							? 'cancel new location'
							: 'cancel'}
					</StyledCancelButton>
				</StyledCancelButtonContainer>
			</>
		)
	}

	private updateValues(value: Partial<TravelTimeAbstraction> | null) {
		if (value) {
			this.setState({
				title: value.title,
				location: value.location,
				duration: value.duration,
				transport: value.transport
			})
		} else {
			this.setState({
				title: undefined,
				location: undefined,
				duration: undefined,
				transport: undefined
			})
		}
	}

	private renderInputAddress() {
		return (
			<PlacesAutocomplete
				value={this.state.title || ''}
				onChange={this.handlePlacesAutocompleteChange}
				onSelect={this.handlePlacesAutocompleteSelect}
				searchOptions={{
					location: new google.maps.LatLng(52.3645568, 4.8958031),
					radius: 25000,
					types: ['address']
				}}
			>
				{({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
					<StyledAutocompleteContainer>
						<StyledSegment>
							<StyledLabel htmlFor='address' className='label' color={this.props.color}>From</StyledLabel>
							<StyledAddressInput
								{...getInputProps({
									placeholder: 'Address',
									name: 'address',
									onBlur: () => {
										// Devices with an on screen keyboard (e.g. a mobile phone) scroll to the input
										// field so that the input field is always in view, it does unfortunately not
										// reset when you close the keyboard
										window.scrollTo(0, 0)
									}
								})}
							/>
						</StyledSegment>
						<StyledAutocompleteDropdownContainer>
							{loading && <StyledLoader>Loading...</StyledLoader>}
							{suggestions.map(suggestion => {
								return (
									<StyledAutocompleteSuggestion
										{...getSuggestionItemProps(suggestion)}
										active={suggestion.active}
										color={this.props.color}
									>
										<p>{suggestion.description}</p>
									</StyledAutocompleteSuggestion>
								);
							})}
						</StyledAutocompleteDropdownContainer>
					</StyledAutocompleteContainer>
				)}
			</PlacesAutocomplete>
		)
	}

	private handlePlacesAutocompleteChange = (title: string) => {
		this.setState({title})
	}

	private handlePlacesAutocompleteSelect = (title: string) => {
		geocodeByAddress(title)
			.then(async (results) => {
				this.setState({
					title,
					location: {
						title,
						...await getLatLng(results[0])
					}
				})
			})
	}

	private renderInputDuration() {
		type Entry = {value: number, label: string}
		const options: Entry[] = [
			{ value: 900, label: '15 minutes' },
			{ value: 1800, label: '30 minutes' },
			{ value: 2700, label: '45 minutes' },
			{ value: 3600, label: '60 minutes' },
		]

		const currentOption = options.filter((t) => t.value === this.state.duration)[0] || ''
		return (
			<StyledSegment>
				<StyledLabel className='label' as='p' color={this.props.color}>in</StyledLabel>
				<StyledSelect
					styles={{control: () => null}}
					classNamePrefix='react-select'
					minWidth={110}
					value={currentOption}
					onChange={(v: Entry) => v && 'value' in v && this.setState({duration: v.value})}
					onBlur={() => {
						// Devices with an on screen keyboard (e.g. a mobile phone) scroll to the input field so that
						// the input field is always in view, it does unfortunately not reset when you close the
						// keyboard
						window.scrollTo(0, 0)
					}}
					options={options}
					components={{
						DropdownIndicator: () => <DropdownIcon style={{marginLeft: '.25rem'}}/>,
						IndicatorSeparator: null
					}}
					color={this.props.color}
				/>
			</StyledSegment>
		)
	}

	private renderInputTraveltype() {
		type Entry = {value: TransportType, label: React.ReactNode}
		const options: Entry[] = [
			{ value: TransportType.Walking, label: getTravelTypeInfo(TransportType.Walking).name },
			{ value: TransportType.Cycling_PublicTransport, label: getTravelTypeInfo(TransportType.Cycling_PublicTransport).name },
			{ value: TransportType.PublicTransport, label: getTravelTypeInfo(TransportType.PublicTransport).name },
			{ value: TransportType.Cycling, label: getTravelTypeInfo(TransportType.Cycling).name },
			{ value: TransportType.Driving, label: getTravelTypeInfo(TransportType.Driving).name }
		]

		const currentOption = options.filter((t) => t.value === this.state.transport)[0] || ''

		return (
			<StyledSegment withoutRightMargin={true}>
				<StyledLabel className='label' as='p' color={this.props.color}>by</StyledLabel>
				<StyledSelect
					styles={{control: () => null}}
					classNamePrefix='react-select'
					minWidth={160}
					value={currentOption}
					onChange={(v: Entry) => v && 'value' in v && this.setState({transport: v.value})}
					onBlur={() => {
						// Devices with an on screen keyboard (e.g. a mobile phone) scroll to the input field so that
						// the input field is always in view, it does unfortunately not reset when you close the
						// keyboard
						window.scrollTo(0, 0)
					}}
					options={options}
					components={{
						DropdownIndicator: () => <DropdownIcon style={{marginLeft: 10}}/>,
						IndicatorSeparator: () => (
							<StyledDropdownIconContainer>
								{getTravelTypeInfo(currentOption.value).icon}
							</StyledDropdownIconContainer>
						)
					}}
					color={this.props.color}
				/>
			</StyledSegment>
		)
	}

	private isValid(travelTime: Partial<TravelTimeAbstraction>): boolean {
		return !!(
			// Ensure that a title has been set (an empty string is valid)
			typeof travelTime.title === 'string'
			// Ensure that the location object exists and the properties are filled in correctly
			&& travelTime.location
			&& typeof travelTime.title === 'string'
			&& travelTime.location.lat > 0
			&& travelTime.location.lng > 0
			// Ensure that a `TransportType` has been set, this enum is a string at runtime
			&& travelTime.transport
			// Ensure that the duration exists and is within the valid range
			&& travelTime.duration
			&& travelTime.duration >= 60
			&& travelTime.duration <= 14400
		)
	}
}

const mapStateToProps = (state: ReduxState) => ({})

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({}, dispatch)

export const EditTravelTime = connect<StateProps, DispatchProps, Props, ReduxState>(
	mapStateToProps,
	mapDispatchToProps,
	null,
	{
		forwardRef: true
	}
)(Component)
