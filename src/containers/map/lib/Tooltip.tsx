import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { OverlayView } from "react-google-maps";
import styled, { css } from "styled-components";
import { Trans } from "@lingui/macro";

import {
  ReduxState,
  setTooltip,
  setNewTravelTimeDetails,
} from "../../../store";
import { AddIcon, CrossIcon } from "../../../icons";
import { colors, shadows } from "../../../constants";

const StyledTooltip = styled.div`
  position: relative;
  width: 250px;
  ${shadows.normal};
  border-radius: 5px;
  background-color: #fff;
  font-size: 1rem;

  :after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(45deg);
    border-bottom-right-radius: 3px;
    width: 10px;
    height: 10px;
    background-color: white;
  }
`;

const StyledTooltipHeader = styled.div`
  background-color: ${colors.darkGrey};
  padding: 0.75rem;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const StyledTooltipHeaderContent = styled.div`
  color: #fff;
  padding-right: 0.5rem;
  flex: 1;
`;

const StyledTooltipHeaderIcon = styled(CrossIcon)`
  color: #fff;
`;

const StyledContentContainer = styled.div<{ isDisabled: boolean }>`
  cursor: ${(props) => (props.isDisabled ? "default" : "pointer")};
  ${(props) =>
    props.isDisabled &&
    css`
      opacity: 0.5;
    `};
  padding: 0.75rem;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const StyledIconContainer = styled.div<{ isDisabled: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 0.5rem;
  background-color: rgba(0, 0, 0, 0.1);
  transition: 100ms;
  border-radius: 99px;

  & > * {
    max-width: 1rem;
    max-height: 1rem;
  }

  ${StyledContentContainer}:hover & {
    ${(props) =>
      !props.isDisabled &&
      css`
        transform: scale(1.2);
      `};
  }
`;

interface StateProps {
  travelTimes: ReduxState["travelTime"]["travelTimes"];
  tooltip: ReduxState["application"]["tooltip"];
}
interface DispatchProps {
  setTooltip: typeof setTooltip;
  setNewTravelTimeDetails: typeof setNewTravelTimeDetails;
}
interface Props {}
type PropsUnion = StateProps & DispatchProps & Props;

interface State {}

export class Component extends React.Component<PropsUnion, State> {
  public readonly state: State = {};

  public render() {
    const { tooltip, travelTimes } = this.props;

    if (!tooltip) return null;

    return (
      <OverlayView
        position={{
          lat: tooltip.lat,
          lng: tooltip.lng,
        }}
        mapPaneName={OverlayView.FLOAT_PANE}
        getPixelPositionOffset={(width, height) => ({
          x: -(width / 2),
          y: -height,
        })}
      >
        <StyledTooltip>
          <StyledTooltipHeader>
            <StyledTooltipHeaderContent>
              {tooltip.title}
            </StyledTooltipHeaderContent>
            <StyledTooltipHeaderIcon />
          </StyledTooltipHeader>
          <StyledContentContainer
            isDisabled={!!(travelTimes && travelTimes.length >= 6)}
            onClick={() => {
              if (travelTimes && travelTimes.length >= 6) return;
              this.props.setNewTravelTimeDetails({
                title: tooltip.title,
                location: {
                  title: tooltip.title,
                  lat: tooltip.lat,
                  lng: tooltip.lng,
                },
              });
            }}
          >
            <StyledIconContainer
              isDisabled={!!(travelTimes && travelTimes.length >= 6)}
            >
              <AddIcon />
            </StyledIconContainer>
            <p>
              <Trans>Add this location</Trans>
            </p>
          </StyledContentContainer>
        </StyledTooltip>
      </OverlayView>
    );
  }
}

const mapStateToProps = (state: ReduxState) => ({
  travelTimes: state.travelTime.travelTimes,
  tooltip: state.application.tooltip,
});
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      setTooltip,
      setNewTravelTimeDetails,
    },
    dispatch
  );

export const Tooltip = connect<StateProps, DispatchProps, Props, ReduxState>(
  mapStateToProps,
  mapDispatchToProps
)(Component);
