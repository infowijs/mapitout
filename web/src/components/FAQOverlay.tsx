import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import styled, { css } from 'styled-components'

import { ReduxState, setDemoVisibility, setFaqVisibility } from 'store'
import { CrossIcon } from 'icons'

const StyledContainer = styled.div<{visible: boolean}>`
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
	left: 0;
	box-sizing: border-box;
	z-index: 100;
	overflow: scroll;
	padding: 10rem 1rem 2rem;
	transition: 250ms;
	
	${(props) => props.visible ? css`
		backdrop-filter: blur(2px);
		background-color: rgba(0, 0, 0, .25);
	` : css`
		backdrop-filter: blur(0px);
		background-color: rgba(0, 0, 0, 0);
		pointer-events: none;
	`}
`

const StyledContent = styled.div<{visible: boolean}>`
	position: relative;
	width: 100%;
	max-width: 40rem;
	margin: 0 auto;
	padding: 2.5rem;
	background: #fff;
	border-radius: 30px;
	box-sizing: border-box;
	transition: 250ms;
	
	${(props) => !props.visible && css`
		margin-top: 70vh;
		opacity: 0;
	`}
	
	@media (max-width: 900px) {
		padding-top: 4rem;
	}
`

const StyledContentSegment = styled.div`
	margin-bottom: 2rem;
	
	h1 {
		margin-bottom: 1rem;
		font-weight: bold;
	}
	p, ul {
		color: rgba(0, 0, 0, .45);
		line-height: 1.5rem;
	}
	p {
		margin-bottom: 1rem;
	}
	li {
		margin: .25rem 0;
	}
	a {
		color: rgba(0, 0, 0, .75);
		
		:hover {
			color: #000;
		}
	}
`

const StyledCloseButton = styled.div`
	cursor: pointer;
	
	@media (min-width: 900px) {
		width: 35px;
		height: 35px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 99px;
		background-color: rgba(0, 0, 0, .5);
		position: absolute;
		top: -.5rem;
		right: -.5rem;
		transform: translate(100%, -100%);
		
		svg {
			color: white;
		}
	}
	@media (max-width: 900px) {
		position: absolute;
		top: 1rem;
		right: 1rem;
	}
`

interface StateProps {
	faqVisible: ReduxState['application']['faqVisible']
}

interface DispatchProps {
	setFaqVisibility: typeof setFaqVisibility
	setDemoVisibility: typeof setDemoVisibility
}

type PropsUnion = StateProps & DispatchProps

class Component extends React.Component<PropsUnion> {
	public render() {
		return (
			<StyledContainer visible={this.props.faqVisible}>
				<StyledContent visible={this.props.faqVisible}>
					<StyledCloseButton onClick={() => this.props.setFaqVisibility(false)}>
						<CrossIcon/>
					</StyledCloseButton>
					<StyledContentSegment>
						<h1>What is the MapitOut tool?</h1>
						<p>The MapitOut tool is an interactive map that allows you to select a location to live in by entering desired travel times to different locations. You can find out more about the various parts of the Amsterdam Area on the <a href='https://www.iamsterdam.com/en/living/about-living-in-amsterdam/living-in-the-amsterdam-area' target='_blank'>‘Living in the Amsterdam Area’ section of the I amsterdam website</a>. Internationals who have come to work in the Amsterdam Area can find reliable information about what makes the region unique, including videos and testimonials of people living there.</p>
						<p>Please note that the tool is not intended for planning travel in real-time. Refer to real-time travel platforms such as <a href='https://www.ov9292.nl/en' target='_blank'>www.ov9292.nl/en</a> for public transport information. </p>
					</StyledContentSegment>
					<StyledContentSegment>
						<h1>Who is the tool for?</h1>
						<p>Anyone interested in learning more about travel times in the Netherlands can use the MapitOut tool! It was designed in English to help internationals who have come to work in the Amsterdam Area, but it also uses symbols and visual elements to assist non-English speakers.</p>
					</StyledContentSegment>
					<StyledContentSegment>
						<h1>How does the tool work?</h1>
						<p>Say you would want to travel for up to half an hour to your workplace by taking public transport, while at the same time being no further than 15 minutes from your children’s school by bike – MapitOut will then show you the overlapping area. This overlapping area shows potential living areas which meet both travel time criteria. You can continue to add more locations, such as your partner’s workplace or a friend’s home.  <a href='#' onClick={() => this.props.setDemoVisibility(true)}>Watch the MapitOut tutorial video to see it in action</a>.</p>
					</StyledContentSegment>
					<StyledContentSegment>
						<h1>How can I access the tool?</h1>
						<p>The MapitOut tool can be accessed through the ‘Living in the Amsterdam Area’ page mentioned above or directly at <a href='https://mapitout.iamsterdam.com' target='_blank'>https://mapitout.iamsterdam.com</a>.</p>
					</StyledContentSegment>
					<StyledContentSegment>
						<h1>What should I do if the tool isn’t working?</h1>
						<p>Oh no! First, try refreshing the url or try another browser (e.g. Firefox or Chrome). If you still have issues, contact us by email: <a href='mailto:welcome@amsterdam.nl'>welcome@amsterdam.nl</a> mentioning you have a question/remark regarding the MapitOut tool. Feel free to include print screens and details of your browser.</p>
					</StyledContentSegment>
					<StyledContentSegment>
						<h1>Which travel information does it use?</h1>
						<p>Travel times are calculated using various data sources. Google Maps is used to create the base level map to show where paths, roads and stations are located. Public transport timetable data is then layered on top including agencies such as GVB, FlixBus, NS, R-Net and more. Driving, cycling and walking time models are developed by TravelTime platform. <a href='https://www.traveltimeplatform.com/turn-radius-maps-into-travel-time' target='_blank'>Find more information about the TravelTime platform.</a></p>
					</StyledContentSegment>
					<StyledContentSegment>
						<h1>How is the reach of a cycling and public transport search determined?</h1>
						<p>The tool assumes the user can cycle at the start of each journey, and that residents can cycle for up to 10 minutes to reach their first public transport connection. It also allows five minutes for the cyclist to park their bike. It also assumes users are willing to walk to an initial transport mode (if quicker) and walk to transfer between modes.</p>
						<p>Once the traveller takes a mode of public transport, such as a train, the tool assumes travel continues via public transport for the remainder of the journey. The only exception to this is ferries because residents often take bikes with them on this mode.</p>
						<p>Some example journeys within 30 minutes</p>
						<ul>
							<li>Cycle 8 minutes + park 5 minutes + walk 5 minutes + metro 12 minutes (30 minutes)</li>
							<li>Cycle 10 minutes, park 5 minutes + train 15 minutes (30 minutes)</li>
							<li>Walk 12 minutes (12 minutes – still reachable in under 30 minutes)</li>
						</ul>
					</StyledContentSegment>
					<StyledContentSegment>
						<h1>I would like to offer this tool as well, is that possible?</h1>
						<p>That is great, maybe we can help. You can always refer to the MapitOut tool. However, you might want to apply the functionality of the tool to your own website. The application is built as open-source, which means you can fork the tool. To make the tool work like the MapitOut tool, you do need to close separate data contracts (e.g. the TravelTime platform). You can find the information required on <a href='https://github.com/infowijs/mapitout' target='_blank'>Github</a>.</p>
					</StyledContentSegment>
				</StyledContent>
			</StyledContainer>
		)
	}
}

const mapStateToProps = (state: ReduxState) => ({
	faqVisible: state.application.faqVisible
})

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
	setFaqVisibility,
	setDemoVisibility
}, dispatch)

export const FAQOverlay = connect(
	mapStateToProps,
	mapDispatchToProps
)(Component)
