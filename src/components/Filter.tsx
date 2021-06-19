import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import styled, { css } from "styled-components";

import {
  ReduxState,
  setOnlyInternationalVisibility,
  setPrimaryEducationVisibility,
  setSecondaryEducationVisibility,
} from "../store";
import { CrossIcon, FilterIcon } from "../icons";
import { colors } from "../constants";

import addresses from "../assets/schools.json";

import educationPrimaryIcon from "../assets/primary.svg";
import educationSecondaryIcon from "../assets/secondary.svg";
import { Address } from "../interfaces";
import { Trans } from "@lingui/macro";

const StyledContainer = styled.div`
  position: relative;
`;

const StyledContainerOverflow = styled.div<{
  isEditing: boolean;
  active: boolean;
  contentHeight: number;
}>`
  position: absolute;
  bottom: 0;
  height: ${(props) => (props.active ? props.contentHeight : 0) + 60}px;
  transition: 400ms;
  width: 100%;
  overflow: hidden;
  z-index: 200;

  ${(props) =>
    props.isEditing &&
    css`
      @media (max-width: 900px) {
        height: 0;
      }
    `}
`;

const StyledFilter = styled.div`
  position: absolute;
  top: 0;
  pointer-events: auto;
  width: 100%;
`;

const StyledHeader = styled.div<{ active: boolean }>`
  ${(props) =>
    !props.active &&
    css`
      cursor: pointer;
    `};
  background-color: ${(props) => (props.active ? colors.red : "#fff")};
  height: 60px;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 30px 30px 0 0;
  transition: 200ms;

  p {
    color: ${(props) => (props.active ? "#fff" : "#000")};
    padding-left: 1rem;
    flex: 1;
  }
`;

const StyledIconContainer = styled.div`
  cursor: pointer;
  position: relative;
  width: 60px;
  height: 60px;
`;

const StyledIcon = styled.div<{
  visible: boolean;
  index: 0 | 1;
  active: boolean;
}>`
  position: absolute;
  top: 50%;
  left: 50%;
  ${(props) =>
    props.visible
      ? css`
          transform: translate(-50%, -50%);
        `
      : props.index === 0
      ? css`
          transform: translate(-25%, -50%);
        `
      : css`
          transform: translate(-75%, -50%);
        `};
  transition: 200ms;
  opacity: ${(props) => (props.visible ? 1 : 0)};
  color: ${(props) => (props.active ? "#fff" : "#000")};
`;

const StyledContent = styled.div`
  padding: 1rem;
  background-color: #fff;
`;

const StyledFilterInfo = styled.p`
  opacity: 0.25;
  text-align: center;
`;

const StyledFilterOptionContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
`;

const StyledFilterOption = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;

  @media (min-width: 500px) {
    :not(:last-child) {
      margin-right: 0.5rem;
    }
  }
  @media (max-width: 500px) {
    :not(:last-child) {
      margin-bottom: 0.5rem;
    }
  }

  p {
    margin-right: 0.25rem;
  }
`;

const StyledMarkerIcon = styled.img`
  margin-right: 0.5rem;
`;

const StyledLabel = styled.p<{ disabled: boolean }>`
  flex: 1;

  ${(props) =>
    props.disabled &&
    css`
      opacity: 0.5;
    `};
`;

const StyledToggle = styled.label`
  position: relative;
  display: block;
  width: 60px;
  height: 34px;
  flex-shrink: 0;
`;

const StyledToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`;

const StyledToggleVirtual = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #d8d8d8;
  transition: 200ms;
  border-radius: 99px;

  :disabled {
    opacity: 0.5;
    cursor: auto;
  }

  :before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: #fff;
    transition: 200ms;
    border-radius: 99px;
  }

  ${StyledToggleInput}:checked + & {
    background-color: #000;

    :before {
      transform: translateX(26px);
    }
  }
`;

const StyledInternationalFilter = styled.label`
  position: relative;
  display: block;
  cursor: pointer;
`;

const StyledInternationalFilterInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  display: none;
`;

const StyledInternationalFilterVirtual = styled.span`
  position: relative;
  display: flex;
  flex-direction: row;
  border: 1px solid #26afb6;
  border-radius: 99px;
  margin-top: 1rem;
  margin-bottom: 1rem;
  overflow: hidden;
  z-index: 0;

  span {
    width: 50%;
    padding: 0.25rem 0;
    text-align: center;
    transition: 100ms;

    @media (max-width: 400px) {
      font-size: 92%;
    }

    &:nth-child(1) {
      color: #fff;
    }
    &:nth-child(2) {
      color: #26afb6;
    }
  }

  :before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 50%;
    height: 100%;
    background-color: #26afb6;
    transition: 100ms;
    z-index: -1;
  }

  ${StyledInternationalFilterInput}:checked + & {
    :before {
      left: 50%;
    }
    span {
      :nth-child(1) {
        color: #26afb6;
      }
      :nth-child(2) {
        color: #fff;
      }
    }
  }
`;

interface StateProps {
  primaryEducationVisible: ReduxState["application"]["primaryEducationVisible"];
  secondaryEducationVisible: ReduxState["application"]["secondaryEducationVisible"];
}
interface DispatchProps {
  setPrimaryEducationVisibility: typeof setPrimaryEducationVisibility;
  setSecondaryEducationVisibility: typeof setSecondaryEducationVisibility;
  setOnlyInternationalVisibility: typeof setOnlyInternationalVisibility;
}
interface Props {
  isEditing: boolean;
}
type PropsUnion = StateProps & DispatchProps & Props;

interface State {
  active: boolean;
  height: number;
  primaryEducationAvailable: boolean;
  secondaryEducationAvailable: boolean;
}

export class Component extends React.Component<PropsUnion, State> {
  private isEducationGroupAvailable = (type: string) =>
    !!(addresses as Address[]).find(
      (address) =>
        !!address.schools.find((school) =>
          [type, "mixed"].includes(school.type)
        )
    );

  public readonly state: State = {
    active: false,
    height: 0,
    primaryEducationAvailable: this.isEducationGroupAvailable("primary"),
    secondaryEducationAvailable: this.isEducationGroupAvailable("secondary"),
  };
  public contentRef = React.createRef<HTMLDivElement>();

  public componentDidMount(): void {
    this.storeContentSize();
    window.addEventListener("resize", this.storeContentSize);
  }

  public storeContentSize = () => {
    if (!this.contentRef.current) return;
    this.setState({
      height: this.contentRef.current.getBoundingClientRect().height,
    });
  };

  public render() {
    const { active, height } = this.state;
    const { isEditing } = this.props;
    return (
      <StyledContainer>
        <StyledContainerOverflow
          active={active}
          contentHeight={height}
          isEditing={isEditing}
        >
          <StyledFilter>
            <StyledHeader
              active={active}
              onClick={() => !active && this.setState({ active: true })}
            >
              <p>
                <Trans>Points of interest</Trans>
              </p>
              <StyledIconContainer
                onClick={() => active && this.setState({ active: false })}
              >
                <StyledIcon active={active} visible={!active} index={0}>
                  <FilterIcon />
                </StyledIcon>
                <StyledIcon active={active} visible={active} index={1}>
                  <CrossIcon />
                </StyledIcon>
              </StyledIconContainer>
            </StyledHeader>
            <StyledContent ref={this.contentRef}>
              {this.renderFilterContent()}
            </StyledContent>
          </StyledFilter>
        </StyledContainerOverflow>
      </StyledContainer>
    );
  }

  private renderFilterContent() {
    return (
      <>
        <StyledFilterOptionContainer>
          <StyledFilterOption>
            <StyledMarkerIcon
              src={educationPrimaryIcon}
              alt="Primary education icon"
            />
            <StyledLabel disabled={!this.state.primaryEducationAvailable}>
              <Trans>Primary education</Trans>
            </StyledLabel>
            <StyledToggle>
              <StyledToggleInput
                type="checkbox"
                defaultChecked={this.props.primaryEducationVisible}
                disabled={!this.state.primaryEducationAvailable}
                onChange={(e) =>
                  this.props.setPrimaryEducationVisibility(e.target.checked)
                }
                onFocus={() => this.setState({ active: true })}
              />
              <StyledToggleVirtual />
            </StyledToggle>
          </StyledFilterOption>
          <StyledFilterOption>
            <StyledMarkerIcon
              src={educationSecondaryIcon}
              alt="Secondary education icon"
            />
            <StyledLabel disabled={!this.state.secondaryEducationAvailable}>
              <Trans>Secondary education</Trans>
            </StyledLabel>
            <StyledToggle>
              <StyledToggleInput
                type="checkbox"
                defaultChecked={this.props.secondaryEducationVisible}
                disabled={!this.state.secondaryEducationAvailable}
                onChange={(e) =>
                  this.props.setSecondaryEducationVisibility(e.target.checked)
                }
                onFocus={() => this.setState({ active: true })}
              />
              <StyledToggleVirtual />
            </StyledToggle>
          </StyledFilterOption>
        </StyledFilterOptionContainer>
        <StyledInternationalFilter>
          <StyledInternationalFilterInput
            type="checkbox"
            defaultChecked={this.props.secondaryEducationVisible}
            onChange={(e) =>
              this.props.setOnlyInternationalVisibility(e.target.checked)
            }
            onFocus={() => this.setState({ active: true })}
          />
          <StyledInternationalFilterVirtual>
            <span>
              <Trans>all schools</Trans>
            </span>
            <span>
              <Trans>only international</Trans>
            </span>
          </StyledInternationalFilterVirtual>
        </StyledInternationalFilter>
        <StyledFilterInfo>
          <Trans>Markers are only visible on lower zoom levels</Trans>
        </StyledFilterInfo>
      </>
    );
  }
}

const mapStateToProps = (state: ReduxState) => ({
  primaryEducationVisible: state.application.primaryEducationVisible,
  secondaryEducationVisible: state.application.secondaryEducationVisible,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      setPrimaryEducationVisibility,
      setSecondaryEducationVisibility,
      setOnlyInternationalVisibility,
    },
    dispatch
  );

export const Filter = connect<StateProps, DispatchProps, Props, ReduxState>(
  mapStateToProps,
  mapDispatchToProps
)(Component);
