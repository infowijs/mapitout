import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import styled, { css } from "styled-components";

import { ReduxState, setDemoVisibility } from "../store";
import { CrossIcon } from "../icons";

const StyledContainer = styled.div<{ visible: boolean }>`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  box-sizing: border-box;
  z-index: 110;
  overflow: scroll;
  padding: 10rem 1rem 2rem;
  transition: 250ms;

  @media (max-width: 900px) {
    padding-top: 1rem;
  }

  ${(props) =>
    props.visible
      ? css`
          backdrop-filter: blur(2px);
          background-color: rgba(0, 0, 0, 0.25);
        `
      : css`
          backdrop-filter: blur(0px);
          background-color: rgba(0, 0, 0, 0);
          pointer-events: none;
        `}
`;

const StyledContent = styled.div<{ visible: boolean }>`
  position: relative;
  width: 100%;
  max-width: 60rem;
  margin: 0 auto;
  padding: 2.5rem;
  background: #fff;
  border-radius: 30px;
  box-sizing: border-box;
  transition: 250ms;

  ${(props) =>
    !props.visible &&
    css`
      margin-top: 70vh;
      opacity: 0;
    `}

  @media (max-width: 900px) {
    padding-top: 4rem;
  }
`;

const StyledVideoContainer = styled.div`
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
  max-width: 100%;

  iframe,
  object,
  embed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

const StyledCloseButton = styled.div`
  cursor: pointer;

  @media (min-width: 900px) {
    width: 35px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 99px;
    background-color: rgba(0, 0, 0, 0.5);
    position: absolute;
    top: -0.5rem;
    right: -0.5rem;
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
`;

interface StateProps {
  demoVisible: ReduxState["application"]["demoVisible"];
}

interface DispatchProps {
  setDemoVisibility: typeof setDemoVisibility;
}

type PropsUnion = StateProps & DispatchProps;

class Component extends React.Component<PropsUnion> {
  public render() {
    return (
      <StyledContainer visible={this.props.demoVisible}>
        <StyledContent visible={this.props.demoVisible}>
          <StyledCloseButton
            onClick={() => this.props.setDemoVisibility(false)}
          >
            <CrossIcon />
          </StyledCloseButton>
          <StyledVideoContainer>
            {this.props.demoVisible && (
              <iframe
                src="https://www.youtube.com/embed/_01cZwF2_bk"
                frameBorder="0"
                title="Demo video"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </StyledVideoContainer>
        </StyledContent>
      </StyledContainer>
    );
  }
}

const mapStateToProps = (state: ReduxState) => ({
  demoVisible: state.application.demoVisible,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      setDemoVisibility,
    },
    dispatch
  );

export const DemoOverlay = connect(
  mapStateToProps,
  mapDispatchToProps
)(Component);
