import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import styled, { css } from "styled-components";
import CopyToClipboard from "react-copy-to-clipboard";
import { Trans } from "@lingui/macro";

import {
  ReduxState,
  getTravelTimes,
  removeTravelTime,
  purgeTravelTimes,
  setOverlapState,
  setBlogVisibility,
} from "../../../store";
import { TravelTimeAbstraction } from "../../../interfaces";
import {
  AddIcon,
  InfoIcon,
  LayersIcon,
  LinkIcon,
  LogoIcon,
} from "../../../icons";
import { colorList, hexColorToRGBA } from "../../../utils";
import {
  EditTravelTime,
  Loader,
  Filter,
  TravelCard,
  DemoOverlay,
  FAQOverlay,
  BlogLink,
} from "../../../components";
import { shadows } from "../../../constants";

const StyledUIContainer = styled.div<{ menuActive: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  box-sizing: border-box;
  height: 100%;
  display: flex;
  flex-direction: column;

  @media (max-width: 900px) {
    transition: left 300ms;
    left: ${(props) => (props.menuActive ? 0 : "-100%")};
    ${(props) =>
      props.menuActive &&
      css`
        overflow: scroll;
      `}
  }
`;

const StyledUIContainerInner = styled.div<{ isEditing: boolean }>`
  ${(props) =>
    !props.isEditing &&
    css`
      @media (min-width: 900px) {
        width: 27rem;
      }
    `};
  @media (max-width: 900px) {
    overflow: visible;
  }
  overflow: auto;

  scrollbar-width: none;
  -ms-overflow-style: none;

  ::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 900px) {
    padding-left: 100vw;
  }
`;

const StyledUIContainerInnerContent = styled.div`
  padding: 1rem 1rem 60px;
  pointer-events: none;

  @media (max-width: 900px) {
    padding-top: 2rem;
    width: 2.5rem;
    overflow: visible;
  }
`;

const StyledSlogan = styled.h1`
  margin-bottom: 1rem;
  margin-left: 0.5rem;
  white-space: nowrap;
`;

const StyledFilterContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 0;
  width: 27rem;
  max-width: 100vw;
  box-sizing: border-box;

  padding: 0 1rem;
`;

const StyledLogoContainer = styled.div`
  position: absolute;
  top: 0;
  right: 1rem;
  z-index: 10;
`;

const StyledActionContainer = styled.div`
  margin-top: 0.5rem;
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
`;

const StyledAction = styled.div<{ isDisabled?: boolean }>`
  pointer-events: auto;
  position: relative;
  cursor: ${(props) => (props.isDisabled ? "default" : "pointer")};
  transition: 100ms;
  opacity: ${(props) => (props.isDisabled ? 0.5 : 1)};
  margin: 0.75rem 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  z-index: 0;

  @media (max-width: 900px) {
    margin: 0.25rem 0;

    p {
      display: none;
    }
  }

  ${(props) =>
    !props.isDisabled &&
    css`
      :before {
        content: "";
        position: absolute;
        top: 10%;
        height: 80%;
        left: 1.25rem;
        background-color: rgba(255, 255, 255, 0.75);
        border-radius: 99px;
        transition: 200ms;
        width: 0;
        z-index: -1;
      }

      @media (min-width: 900px) {
        :hover:before {
          width: 100%;
        }
      }
    `};
`;

const StyledActionIcon = styled.div<{
  isDisabled?: boolean;
  isActive?: boolean;
}>`
  border-radius: 99px;
  background-color: ${(props) => (props.isActive ? "#000" : "#fff")};
  color: ${(props) => (props.isActive ? "#fff" : "#000")};
  margin-right: 0.5em;
  ${shadows.normal};
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 100ms;

  ${(props) =>
    !props.isDisabled &&
    css`
      ${StyledAction}:hover & {
        transform: scale(1.1);
      }
    `}
`;

const StyledCopyNotification = styled.div`
  padding: 0.125rem 0.25rem;
  border-radius: 99px;
  position: absolute;
  bottom: -1rem;
  animation-name: anim;
  animation-duration: 3000ms;
  white-space: nowrap;
  background-color: #fff;

  @media (max-width: 900px) {
    p {
      display: initial;
    }

    bottom: 50%;
    transform: translateY(50%);
  }

  p {
    font-size: 0.625rem !important;
  }

  @keyframes anim {
    0% {
      left: 2rem;
      opacity: 0;
    }
    10% {
      left: 3rem;
      opacity: 1;
    }
    90% {
      left: 3rem;
      opacity: 0.75;
    }
    100% {
      left: 2rem;
      opacity: 0;
    }
  }
`;

const StyledLoaderContainer = styled.div`
  margin: 1rem;
`;

const sharedWrapperVisibilityAnimation = css<{ visible: boolean }>`
  pointer-events: ${(props) => (props.visible ? "auto" : "none")};
  transition: 500ms;

  ${(props) =>
    props.visible
      ? css`
          @media (min-width: 900px) {
            max-height: 200px;
            opacity: 1;
          }
        `
      : css`
          @media (min-width: 900px) {
            max-height: 0;
            opacity: 0;
          }
          @media (max-width: 900px) {
            display: none;
          }
        `}
`;

const StyledCardContainer = styled.div<{ visible: boolean }>`
  ${sharedWrapperVisibilityAnimation};

  max-width: 25rem;
`;

const StyledEditWrapper = styled.div<{ visible: boolean }>`
  ${sharedWrapperVisibilityAnimation};

  @media (max-width: 900px) {
    position: absolute;
    width: 100vw;
    top: 0;
    left: 0;
    padding: 5rem 1rem 250px;
    box-sizing: border-box;
    z-index: 0;

    :before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        to bottom,
        #d9f0f3 0%,
        #d9f0f3 15%,
        ${hexColorToRGBA("#D9F0F3", 0)} 50%
      );
      z-index: -1;
    }
  }
`;

const StyledEntryTravelTimeContainer = styled.div`
  position: absolute;
  left: 0;
  width: 100%;

  @media (min-width: 900px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 4rem;
  }

  @media (max-width: 900px) {
    padding: 6rem 1rem 400px;
    box-sizing: border-box;
    z-index: 0;
    max-height: 100%;
    overflow: scroll;

    :before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        to bottom,
        #d9f0f3 0%,
        #d9f0f3 15%,
        ${hexColorToRGBA("#D9F0F3", 0)} 50%
      );
      z-index: -1;
    }
  }
`;

const StyledOnboardingTooltipContainer = styled.div`
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;

  @media (max-width: 1200px) {
    display: none;
  }
`;

const StyledOnboardingTooltip = styled.div`
  display: flex;
  margin: 0 1rem 2rem;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 99px;
  min-height: 40px;
  flex-direction: row;
  align-items: center;
  color: white;
  padding: 0 0.75rem;

  @media (max-width: 900px) {
    padding: 0.25rem 0.75rem;
  }

  & > *:first-child {
    min-width: 1rem;
    margin-right: 0.5rem;
  }
`;

interface StateProps {
  loading: ReduxState["travelTime"]["loading"];
  travelTimes: ReduxState["travelTime"]["travelTimes"];
  overlap: ReduxState["travelTime"]["overlap"];
  overlapVisible: ReduxState["application"]["overlapVisible"];
  newTravelTimeDetails: ReduxState["application"]["newTravelTimeDetails"];
  blogVisible: ReduxState["application"]["blogVisible"];
}

interface DispatchProps {
  getTravelTimes: typeof getTravelTimes;
  removeTravelTime: typeof removeTravelTime;
  purgeTravelTimes: typeof purgeTravelTimes;
  setOverlapState: typeof setOverlapState;
  setBlogVisibility: typeof setBlogVisibility;
}

interface Props {}

type PropsUnion = StateProps & DispatchProps & Props;

interface State {
  isCurrentlyAddingNewTravelTime: boolean;
  currentTravelTimeEditing: string | null;
  currentTravelTimeEditSaving: string | null;
  justCopied: boolean;
}

export class Component extends React.Component<PropsUnion, State> {
  public readonly state: State = {
    isCurrentlyAddingNewTravelTime: false,
    currentTravelTimeEditing: null,
    currentTravelTimeEditSaving: null,
    justCopied: false,
  };
  public addressFieldRef = React.createRef<any>();
  public newEditTravelTimeRef =
    React.createRef<typeof EditTravelTime.prototype>();
  public scrollableTravelTimesContainer = React.createRef<HTMLDivElement>();

  public componentDidMount() {}

  public componentDidUpdate(
    prevProps: Readonly<PropsUnion>,
    prevState: Readonly<State>,
    snapshot?: any
  ): void {
    if (
      this.props.overlap &&
      this.props.overlap.shapes &&
      this.props.overlap.shapes.length > 0 &&
      this.props.overlap.shapes[0].shell.length === 0 &&
      this.props.overlapVisible
    ) {
      this.props.setOverlapState(false);
    }
    if (this.props.newTravelTimeDetails !== prevProps.newTravelTimeDetails) {
      this.setState({ isCurrentlyAddingNewTravelTime: true });

      if (this.newEditTravelTimeRef.current) {
        this.newEditTravelTimeRef.current.updateValues(
          this.props.newTravelTimeDetails
        );
      }
    }
    if (this.state.currentTravelTimeEditSaving) {
      this.setState({
        currentTravelTimeEditSaving: null,
      });
    }
  }

  public render() {
    if (!this.props.travelTimes || this.props.travelTimes.length === 0) {
      return (
        <>
          {process.env.REACT_APP_BRANDING ? (
            <>
              <DemoOverlay />
              <FAQOverlay />
              <StyledLogoContainer
                onMouseEnter={() => {
                  if (this.props.blogVisible < 1) {
                    this.props.setBlogVisibility(1);
                  }
                }}
              >
                <LogoIcon />
              </StyledLogoContainer>
              <BlogLink />
            </>
          ) : null}

          <StyledEntryTravelTimeContainer>
            {this.props.loading ? (
              <Loader />
            ) : (
              <EditTravelTime
                ref={this.newEditTravelTimeRef}
                color={colorList[0]}
                onFinish={(v: TravelTimeAbstraction) => {
                  this.addTravelTime(v);
                }}
                onCancel={() => null}
              />
            )}
          </StyledEntryTravelTimeContainer>
          <StyledOnboardingTooltipContainer>
            <StyledOnboardingTooltip>
              <InfoIcon />
              <p>
                <Trans>Click anywhere on the map to add a location</Trans>
              </p>
            </StyledOnboardingTooltip>
          </StyledOnboardingTooltipContainer>
          <StyledFilterContainer>
            <Filter isEditing={true} />
          </StyledFilterContainer>
        </>
      );
    }

    return (
      <>
        {process.env.REACT_APP_BRANDING ? (
          <>
            <DemoOverlay />
            <FAQOverlay />
            <StyledLogoContainer
              onMouseEnter={() => {
                if (this.props.blogVisible < 1) {
                  this.props.setBlogVisibility(1);
                }
              }}
            >
              <LogoIcon />
            </StyledLogoContainer>
            <BlogLink />
          </>
        ) : null}
        <StyledUIContainer
          menuActive={
            !!this.state.currentTravelTimeEditing ||
            this.state.isCurrentlyAddingNewTravelTime
          }
        >
          <StyledUIContainerInner
            ref={this.scrollableTravelTimesContainer}
            isEditing={
              !!this.state.currentTravelTimeEditing ||
              this.state.isCurrentlyAddingNewTravelTime
            }
            onClick={(e) => {
              if (
                (!!this.state.currentTravelTimeEditing ||
                  this.state.isCurrentlyAddingNewTravelTime) &&
                e.target === this.scrollableTravelTimesContainer.current
              ) {
                this.setState({
                  isCurrentlyAddingNewTravelTime: false,
                  currentTravelTimeEditing: null,
                });
              }
            }}
          >
            <StyledUIContainerInnerContent>
              <StyledSlogan>
                <Trans>How far could I live from</Trans>
              </StyledSlogan>
              {this.renderTravelTimes()}
              {this.renderActiveNew()}
              {this.renderLoader()}
              {this.renderMapActions()}
            </StyledUIContainerInnerContent>
          </StyledUIContainerInner>
        </StyledUIContainer>
        <StyledFilterContainer>
          <Filter
            isEditing={
              !!this.state.currentTravelTimeEditing ||
              this.state.isCurrentlyAddingNewTravelTime
            }
          />
        </StyledFilterContainer>
      </>
    );
  }

  private renderTravelTimes() {
    return (
      <>
        {this.props.travelTimes &&
          this.props.travelTimes.map((travelTime, i) => (
            <React.Fragment key={travelTime.res.search_id}>
              <StyledCardContainer
                visible={
                  travelTime.res.search_id !==
                  this.state.currentTravelTimeEditing
                }
                onClick={() =>
                  window.innerWidth <= 900 &&
                  this.edit(travelTime.res.search_id)
                }
              >
                <TravelCard
                  color={colorList[i]}
                  onDelete={() =>
                    this.removeTravelTime(travelTime.res.search_id)
                  }
                  onEdit={() => this.edit(travelTime.res.search_id)}
                  {...travelTime}
                />
              </StyledCardContainer>
              <StyledEditWrapper
                visible={
                  travelTime.res.search_id ===
                  this.state.currentTravelTimeEditing
                }
              >
                <EditTravelTime
                  color={colorList[i]}
                  onFinish={(v: TravelTimeAbstraction) => {
                    this.save(travelTime.res.search_id, v);

                    if (this.newEditTravelTimeRef.current) {
                      this.newEditTravelTimeRef.current.updateValues(null);
                    }
                  }}
                  onCancel={() =>
                    this.setState({
                      currentTravelTimeEditing: null,
                      currentTravelTimeEditSaving: null,
                    })
                  }
                  onDelete={() =>
                    this.removeTravelTime(travelTime.res.search_id)
                  }
                  {...travelTime}
                />
              </StyledEditWrapper>
            </React.Fragment>
          ))}
      </>
    );
  }

  private renderLoader() {
    if (!this.props.loading) {
      return null;
    }

    return (
      <StyledLoaderContainer>
        <Loader />
      </StyledLoaderContainer>
    );
  }

  private renderMapActions() {
    return (
      <StyledActionContainer>
        <StyledAction
          isDisabled={
            !!(this.props.travelTimes && this.props.travelTimes.length >= 6)
          }
          onClick={() => {
            if (
              !(this.props.travelTimes && this.props.travelTimes.length >= 6)
            ) {
              this.setState({
                isCurrentlyAddingNewTravelTime: true,
                currentTravelTimeEditing: null,
                currentTravelTimeEditSaving: null,
              });
            }
          }}
        >
          <StyledActionIcon>
            <AddIcon />
          </StyledActionIcon>
          <p>
            <Trans>Add new location</Trans>
          </p>
        </StyledAction>
        <StyledAction
          isDisabled={!this.isOverlapAvailable()}
          onClick={() => {
            this.isOverlapAvailable();
            this.props.setOverlapState(!this.props.overlapVisible);
            if (this.props.blogVisible < 1) {
              this.props.setBlogVisibility(1);
            }
          }}
        >
          <StyledActionIcon
            isDisabled={!this.isOverlapAvailable()}
            isActive={this.props.overlapVisible}
          >
            <LayersIcon />
          </StyledActionIcon>
          <p>
            {this.isOverlapAvailable() ? (
              this.props.overlapVisible ? (
                <Trans>Back to normal</Trans>
              ) : (
                <Trans>Show overlapping area</Trans>
              )
            ) : (
              <Trans>No overlapping area</Trans>
            )}
          </p>
        </StyledAction>
        <CopyToClipboard text={window.location.href} onCopy={this.handleCopy}>
          <StyledAction>
            <StyledActionIcon>
              <LinkIcon />
            </StyledActionIcon>
            <p>
              {this.props.travelTimes && this.props.travelTimes.length > 1 ? (
                <Trans>Share these locations</Trans>
              ) : (
                <Trans>Share this location</Trans>
              )}
            </p>
            {this.state.justCopied && (
              <StyledCopyNotification>
                <p className="label">
                  <Trans>Copied to clipboard</Trans>
                </p>
              </StyledCopyNotification>
            )}
          </StyledAction>
        </CopyToClipboard>
      </StyledActionContainer>
    );
  }

  private renderActiveNew() {
    return (
      <StyledEditWrapper visible={this.state.isCurrentlyAddingNewTravelTime}>
        <EditTravelTime
          ref={this.newEditTravelTimeRef}
          new={true}
          color={
            colorList[
              (this.props.travelTimes && this.props.travelTimes.length) || 0
            ]
          }
          onFinish={(v: TravelTimeAbstraction) => {
            this.addTravelTime(v);

            if (this.newEditTravelTimeRef.current) {
              this.newEditTravelTimeRef.current.updateValues(null);
            }
          }}
          onCancel={() =>
            this.setState({
              isCurrentlyAddingNewTravelTime: false,
            })
          }
        />
      </StyledEditWrapper>
    );
  }

  private edit = (id: string) => {
    this.setState(
      {
        isCurrentlyAddingNewTravelTime: false,
        currentTravelTimeEditing: id,
      },
      () => this.setFocus()
    );
  };

  private setFocus() {
    if (this.addressFieldRef.current) {
      this.addressFieldRef.current.focus();
    } else {
      setTimeout(() => this.setFocus(), 50);
    }
  }

  private save = (id: string, travelTime: TravelTimeAbstraction) => {
    const data: TravelTimeAbstraction[] = (this.props.travelTimes || []).map(
      (v) => {
        return id === v.res.search_id
          ? travelTime
          : {
              title: v.title,
              location: {
                title: v.location.title,
                lat: v.location.lat,
                lng: v.location.lng,
              },
              duration: v.duration,
              transport: v.transport,
            };
      }
    );

    this.props.getTravelTimes(data);
    this.setState({
      currentTravelTimeEditSaving: id,
      currentTravelTimeEditing: null,
    });
  };

  private addTravelTime = (travelTime: TravelTimeAbstraction) => {
    const currentTravelTimes = this.props.travelTimes || [];
    this.props.getTravelTimes([...currentTravelTimes, travelTime]);
    this.setState({
      isCurrentlyAddingNewTravelTime: false,
    });
  };

  private removeTravelTime = (id: string) => {
    const currentTravelTimes = this.props.travelTimes || [];
    const newTravelTimes = currentTravelTimes.filter(
      (travelTime) => travelTime.res.search_id !== id
    );

    if (newTravelTimes.length === 0) {
      this.props.purgeTravelTimes();
      return;
    }

    this.props.removeTravelTime(id);
    this.props.getTravelTimes([...newTravelTimes]);
  };

  private handleCopy = () => {
    this.setState(
      {
        justCopied: true,
      },
      () =>
        setTimeout(
          () =>
            this.setState({
              justCopied: false,
            }),
          3000
        )
    );
  };

  private isOverlapAvailable(): boolean {
    if (!this.props.overlap) {
      return false;
    }
    if (!this.props.travelTimes) {
      return false;
    }

    return (
      this.props.overlap.shapes[0].shell.length > 0 &&
      this.props.travelTimes.length > 1
    );
  }
}

const mapStateToProps = (state: ReduxState) => ({
  loading: state.travelTime.loading,
  travelTimes: state.travelTime.travelTimes,
  overlap: state.travelTime.overlap,
  overlapVisible: state.application.overlapVisible,
  newTravelTimeDetails: state.application.newTravelTimeDetails,
  blogVisible: state.application.blogVisible,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      getTravelTimes,
      removeTravelTime,
      purgeTravelTimes,
      setOverlapState,
      setBlogVisibility,
    },
    dispatch
  );

export const InteractiveOverlay = connect<
  StateProps,
  DispatchProps,
  Props,
  ReduxState
>(
  mapStateToProps,
  mapDispatchToProps
)(Component);
