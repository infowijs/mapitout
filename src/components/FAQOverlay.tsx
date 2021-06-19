import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import styled, { css } from "styled-components";

import { ReduxState, setDemoVisibility, setFaqVisibility } from "../store";
import { CrossIcon } from "../icons";

import { i18n } from "../index";
import { FaqEN } from "./faq/FaqEN";
import { FaqNL } from "./faq/FaqNL";

const StyledContainer = styled.div<{ visible: boolean }>`
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
  max-width: 40rem;
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
  faqVisible: ReduxState["application"]["faqVisible"];
}

interface DispatchProps {
  setFaqVisibility: typeof setFaqVisibility;
  setDemoVisibility: typeof setDemoVisibility;
}

type PropsUnion = StateProps & DispatchProps;

class Component extends React.Component<PropsUnion> {
  public render() {
    return (
      <StyledContainer visible={this.props.faqVisible}>
        <StyledContent visible={this.props.faqVisible}>
          <StyledCloseButton onClick={() => this.props.setFaqVisibility(false)}>
            <CrossIcon />
          </StyledCloseButton>
          {i18n.language === "en" ? (
            <FaqEN setDemoVisibility={this.props.setDemoVisibility} />
          ) : (
            <FaqNL setDemoVisibility={this.props.setDemoVisibility} />
          )}
        </StyledContent>
      </StyledContainer>
    );
  }
}

const mapStateToProps = (state: ReduxState) => ({
  faqVisible: state.application.faqVisible,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      setFaqVisibility,
      setDemoVisibility,
    },
    dispatch
  );

export const FAQOverlay = connect(
  mapStateToProps,
  mapDispatchToProps
)(Component);
