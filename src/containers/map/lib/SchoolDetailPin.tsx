import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { OverlayView } from "react-google-maps";
import styled from "styled-components";
import { Trans } from "@lingui/macro";

import { ReduxState } from "../../../store";
import { CrossIcon, ChevronRightIcon } from "../../../icons";
import { colors, shadows } from "../../../constants";

import iconPrimary from "../../../assets/primary.svg";
import iconSecondary from "../../../assets/secondary.svg";
import iconMixed from "../../../assets/mixed.svg";
import { getValidUrl } from "../../../utils";

const StyledTooltip = styled.div`
  position: relative;
  width: 325px;
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

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledContentItem = styled.a`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0.5rem 1rem;
  color: black;
  text-decoration: none;
`;

const StyledContentItemIcon = styled.div`
  margin-right: 1rem;
  display: flex;
  align-items: center;
  transition: 100ms;

  ${StyledContentItem}:hover & {
    transform: scale(1.1);
  }
`;

const StyledContentItemTitle = styled.div`
  flex: 1;
`;

const StyledContentItemInternationalFlag = styled.span`
  margin-left: 0.5rem;
  padding: 0.1rem 0.5rem;
  border-radius: 99px;
  background-color: #26afb6;
  font-size: 0.6rem;
  text-transform: uppercase;
  color: white;
`;

const StyledOpenWebsiteIcon = styled(ChevronRightIcon)`
  height: 1rem;
  opacity: 0.5;
  transition: 100ms;

  ${StyledContentItem}:hover & {
    opacity: 1;
    transform: translateX(3px);
  }
`;

interface StateProps {
  schoolDetailPin: ReduxState["application"]["schoolDetailPin"];
}
interface DispatchProps {}
interface Props {}
type PropsUnion = StateProps & DispatchProps & Props;

interface State {}

export class Component extends React.Component<PropsUnion, State> {
  public readonly state: State = {};

  public render() {
    const { schoolDetailPin } = this.props;

    if (!schoolDetailPin) return null;

    return (
      <OverlayView
        position={{
          lat: schoolDetailPin.lat,
          lng: schoolDetailPin.lng,
        }}
        mapPaneName={OverlayView.FLOAT_PANE}
        getPixelPositionOffset={(width, height) => ({
          x: -(width / 2),
          y: -(height + 48),
        })}
      >
        <StyledTooltip>
          <StyledTooltipHeader>
            <StyledTooltipHeaderContent>
              {schoolDetailPin && schoolDetailPin.schools.length > 1
                ? "Schools"
                : "School"}
            </StyledTooltipHeaderContent>
            <StyledTooltipHeaderIcon />
          </StyledTooltipHeader>
          <StyledContent>
            {schoolDetailPin &&
              schoolDetailPin.schools.map((school: any) => (
                <StyledContentItem
                  key={school.name}
                  href={getValidUrl(school.url)}
                  target="_blank"
                >
                  <StyledContentItemIcon>
                    {school.type === "primary" && (
                      <img src={iconPrimary} alt="Primary school icon" />
                    )}
                    {school.type === "secondary" && (
                      <img src={iconSecondary} alt="Secondary school icon" />
                    )}
                    {school.type === "mixed" && (
                      <img src={iconMixed} alt="Mixed school icon" />
                    )}
                  </StyledContentItemIcon>
                  <StyledContentItemTitle>
                    {school.name}
                    {school.international && (
                      <StyledContentItemInternationalFlag>
                        <Trans>international</Trans>
                      </StyledContentItemInternationalFlag>
                    )}
                  </StyledContentItemTitle>
                  <StyledOpenWebsiteIcon />
                </StyledContentItem>
              ))}
          </StyledContent>
        </StyledTooltip>
      </OverlayView>
    );
  }
}

const mapStateToProps = (state: ReduxState) => ({
  schoolDetailPin: state.application.schoolDetailPin,
});
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({}, dispatch);

export const SchoolDetailPin = connect<
  StateProps,
  DispatchProps,
  Props,
  ReduxState
>(
  mapStateToProps,
  mapDispatchToProps
)(Component);
