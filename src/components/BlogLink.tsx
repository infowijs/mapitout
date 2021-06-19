import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import styled, { css } from "styled-components";

import { ReduxState, setBlogVisibility } from "../store";
import { CrossIcon } from "../icons";

import { i18n } from "../index";

const StyledContainer = styled.div<{ visible: boolean }>`
  position: absolute;
  top: 3.1rem;
  right: 1rem;
  box-sizing: border-box;
  z-index: 200;
  overflow: scroll;
  transition: 250ms;
  border-radius: 3rem;
  align-items: center;
  background: #fff;
  display: flex;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  @media (max-width: 900px) {
    left: 0.4rem;
    top: 0.4rem;
    right: auto;
  }

  ${(props) =>
    props.visible
      ? css`
          opacity: 1;
        `
      : css`
          opacity: 0;
          pointer-events: none;
        `}
`;

const StyledContent = styled.a`
  position: relative;
  display: block;
  width: 100%;
  color: #777;
  text-decoration: none;
  max-width: 40rem;
  margin: 0 auto;
  padding: 0.6rem 0.3rem;
  padding-left: 1.4rem;
  background: #fff;
  border-radius: 30px;
  box-sizing: border-box;
  transition: 250ms;
  font-size: 0.5rem;

  span {
    display: block;
    font-size: 0.9rem;
    text-decoration: underline;
    color: #fc4d57;
    margin-bottom: 0.15rem;
  }
`;

const StyledCloseButton = styled.div`
  cursor: pointer;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 99px;
  margin-right: 0.6rem;

  svg {
    color: #333;
  }
`;

interface StateProps {
  blogVisible: ReduxState["application"]["blogVisible"];
}

interface DispatchProps {
  setBlogVisibility: typeof setBlogVisibility;
}

type PropsUnion = StateProps & DispatchProps;

class Component extends React.Component<PropsUnion> {
  public componentDidMount() {
    setTimeout(() => {
      if (this.props.blogVisible < 1) {
        this.props.setBlogVisibility(1);
      }
    }, 60 * 2 * 1000);
  }

  public render() {
    return (
      <StyledContainer visible={this.props.blogVisible === 1}>
        <StyledContent
          target="_blank"
          href="https://www.iamsterdam.com/en/living/about-living-in-amsterdam/living-in-the-amsterdam-area"
        >
          <span>
            {i18n.language === "en"
              ? "Discover the Amsterdam region"
              : "Ontdek regio Amsterdam"}
          </span>
          iamsterdam.com
        </StyledContent>
        <StyledCloseButton onClick={() => this.props.setBlogVisibility(2)}>
          <CrossIcon />
        </StyledCloseButton>
      </StyledContainer>
    );
  }
}

const mapStateToProps = (state: ReduxState) => ({
  blogVisible: state.application.blogVisible,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      setBlogVisibility,
    },
    dispatch
  );

export const BlogLink = connect(mapStateToProps, mapDispatchToProps)(Component);
