import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { OverlayView } from "react-google-maps";
import styled, { css } from "styled-components";

import { ReduxState } from "../../../store";
import { colorList, getTravelTypeInfo } from "../../../utils";

const StyledMarker = styled.div<{ color: string; minimalStyle: boolean }>`
  position: relative;
  width: ${(props) => (props.minimalStyle ? ".5rem" : "2rem")};
  height: ${(props) => (props.minimalStyle ? ".5rem" : "2rem")};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 99px;
  background-color: ${(props) => props.color};
  color: #fff;
  z-index: 0;

  ${(props) =>
    props.minimalStyle &&
    css`
      & > * {
        opacity: 0;
      }
    `};

  &:before,
  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 99px;
    background-color: ${(props) => props.color};
    z-index: -1;
  }

  &:before {
    transform: ${(props) => (props.minimalStyle ? "scale(2.5)" : "scale(1.8)")};
    opacity: 0.5;
  }

  &:after {
    transform: ${(props) => (props.minimalStyle ? "scale(4)" : "scale(3)")};
    opacity: 0.25;
  }
`;

interface StateProps {
  travelTimes: ReduxState["travelTime"]["travelTimes"];
  overlapVisible: ReduxState["application"]["overlapVisible"];
}
interface DispatchProps {}
interface Props {
  onMarkerClick: (
    travelTimes: NonNullable<ReduxState["travelTime"]["travelTimes"]>
  ) => any;
}
type PropsUnion = StateProps & DispatchProps & Props;

interface State {}

export class Component extends React.Component<PropsUnion, State> {
  public readonly state: State = {};

  public render() {
    const { travelTimes, overlapVisible } = this.props;

    return (
      <>
        {travelTimes &&
          travelTimes.map((travelTime, i) => (
            <OverlayView
              key={i}
              position={travelTime.location}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              getPixelPositionOffset={(width, height) => ({
                x: -(width / 2),
                y: -(height / 2),
              })}
            >
              <StyledMarker
                onClick={() => this.props.onMarkerClick([travelTime])}
                color={colorList[i]}
                minimalStyle={overlapVisible}
              >
                {getTravelTypeInfo(travelTime.transport).icon}
              </StyledMarker>
            </OverlayView>
          ))}
      </>
    );
  }
}

const mapStateToProps = (state: ReduxState) => ({
  travelTimes: state.travelTime.travelTimes,
  overlapVisible: state.application.overlapVisible,
});
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({}, dispatch);

export const Markers = connect<StateProps, DispatchProps, Props, ReduxState>(
  mapStateToProps,
  mapDispatchToProps
)(Component);
