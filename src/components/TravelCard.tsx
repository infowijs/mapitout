import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import styled from "styled-components";
import { t } from "@lingui/macro";
import { i18n } from "../index";

import { ReduxState } from "../store";
import { ClockIcon, CrossIcon, EditIcon } from "../icons";
import { TravelTimeAbstraction } from "../interfaces";
import { getTravelTypeInfo, hexColorToRGBA } from "../utils";
import { shadows } from "../constants";

const StyledTravelCard = styled.div<{ color: string }>`
  border-radius: 2rem;

  background-color: ${(props) => hexColorToRGBA(props.color, 0.9)};
  color: #fff;
  ${shadows.normal};

  @media (min-width: 900px) {
    display: flex;
    flex-direction: row;
    margin-bottom: 16px;
  }

  @media (max-width: 900px) {
    height: 2.5rem;
    width: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.5rem;
  }
`;

const StyledTravelCardInfo = styled.div`
  @media (min-width: 900px) {
    flex: 1;
    padding: 25px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
`;

const StyledTravelCardTitle = styled.h1`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 1rem;

  @media (max-width: 900px) {
    display: none;
  }
`;

const StyledTravelCardInfoMeta = styled.div`
  @media (min-width: 900px) {
    display: flex;
    flex-direction: row;
  }
`;

const StyledTravelCardInfoMetaItem = styled.div`
  @media (min-width: 900px) {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  &:not(:last-child) {
    margin-right: 2rem;

    @media (max-width: 900px) {
      display: none;
    }
  }
  @media (max-width: 900px) {
    &:last-child {
      p {
        display: none;
      }
    }
  }
`;

const StyledTravelCardInfoMetaItemIcon = styled.div`
  width: 1rem;
  height: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (min-width: 900px) {
    margin-right: 0.5rem;
  }
`;

const StyledTravelCardAction = styled.div`
  padding: 1rem 1rem 0 0;

  @media (max-width: 900px) {
    display: none;
  }
`;

const StyledTravelCardActionItem = styled.div`
  cursor: pointer;
  position: relative;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;

  :before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    width: 100%;
    height: 100%;
    transition: 80ms;
  }
  :hover:before {
    transform: scale(1.25);
  }

  svg {
    max-width: 1rem;
    max-height: 1rem;
  }

  &:not(:last-child) {
    margin-bottom: 0.5rem;
  }
`;

interface StateProps {}
interface DispatchProps {}
interface Props extends TravelTimeAbstraction {
  color: string;
  onDelete: () => any;
  onEdit: () => any;
}
type PropsUnion = StateProps & DispatchProps & Props;

interface State {}

export class Component extends React.Component<PropsUnion, State> {
  public readonly state: State = {};

  public render() {
    const { color, location, duration, transport, onDelete, onEdit } =
      this.props;

    let durationLabel = `${duration / 60} minutes`;
    switch (duration) {
      case 900:
        // @ts-ignore
        durationLabel = i18n._(t`15 minutes`);
        break;
      case 1800:
        // @ts-ignore
        durationLabel = i18n._(t`30 minutes`);
        break;
      case 2700:
        // @ts-ignore
        durationLabel = i18n._(t`45 minutes`);
        break;
      case 3600:
        // @ts-ignore
        durationLabel = i18n._(t`60 minutes`);
        break;
    }

    return (
      <StyledTravelCard color={color}>
        <StyledTravelCardInfo>
          <StyledTravelCardTitle>{location.title}</StyledTravelCardTitle>
          <StyledTravelCardInfoMeta>
            <StyledTravelCardInfoMetaItem>
              <StyledTravelCardInfoMetaItemIcon>
                <ClockIcon />
              </StyledTravelCardInfoMetaItemIcon>
              <p className="label" style={{ whiteSpace: "nowrap" }}>
                {durationLabel}
              </p>
            </StyledTravelCardInfoMetaItem>
            <StyledTravelCardInfoMetaItem>
              <StyledTravelCardInfoMetaItemIcon>
                {getTravelTypeInfo(transport).icon}
              </StyledTravelCardInfoMetaItemIcon>
              <p className="label">
                {i18n._(getTravelTypeInfo(transport).name)}
              </p>
            </StyledTravelCardInfoMetaItem>
          </StyledTravelCardInfoMeta>
        </StyledTravelCardInfo>
        <StyledTravelCardAction>
          <StyledTravelCardActionItem onClick={onEdit}>
            <EditIcon />
          </StyledTravelCardActionItem>
          <StyledTravelCardActionItem onClick={onDelete}>
            <CrossIcon />
          </StyledTravelCardActionItem>
        </StyledTravelCardAction>
      </StyledTravelCard>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({}, dispatch);

export const TravelCard = connect<StateProps, DispatchProps, Props, ReduxState>(
  mapStateToProps,
  mapDispatchToProps
)(Component);
