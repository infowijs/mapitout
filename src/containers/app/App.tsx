import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { RouteComponentProps } from "react-router-dom";

import { ReduxState, getTravelTimes } from "../../store";
import { TransportType } from "../../enums";

import { InteractiveOverlay } from "./lib";

interface StateProps {
  travelTimes: ReduxState["travelTime"]["travelTimes"];
}
interface DispatchProps {
  getTravelTimes: typeof getTravelTimes;
}
interface Props {}
type PropsUnion = StateProps &
  DispatchProps &
  Props &
  RouteComponentProps<Params>;

interface State {}

interface Params {
  travelOne: string;
  travelTwo: string;
  travelThree: string;
  travelFour: string;
  travelFive: string;
  travelSix: string;
}

const encodingDivider = "::";

export class Component extends React.Component<PropsUnion, State> {
  public readonly state: State = {};

  constructor(props: PropsUnion) {
    super(props);

    const params = props.match.params;

    const travelsEncoded: string[] = [
      params.travelOne,
      params.travelTwo,
      params.travelThree,
      params.travelFour,
      params.travelFive,
      params.travelSix,
    ].filter((v) => !!v);

    if (travelsEncoded.length === 0) {
      return;
    }

    const travelsDecoded: Parameters<typeof getTravelTimes>[0] =
      travelsEncoded.map((encodedTravel) => {
        const [title, locationTitle, lat, lng, duration, transport] =
          encodedTravel.split(encodingDivider);

        return {
          title,
          location: {
            title: locationTitle,
            lat: parseFloat(lat),
            lng: parseFloat(lng),
          },
          duration: parseInt(duration, 10) * 60,
          transport: transport as TransportType,
        };
      });

    props.getTravelTimes(travelsDecoded);
  }

  public componentDidUpdate(
    prevProps: Readonly<PropsUnion>,
    prevState: Readonly<State>,
    snapshot?: any
  ): void {
    if (
      (this.props.travelTimes ||
        (this.props.travelTimes === null && prevProps.travelTimes !== null)) &&
      this.props.travelTimes !== prevProps.travelTimes
    ) {
      this.props.history.replace("/");
    }

    if (
      this.props.travelTimes &&
      this.props.travelTimes !== prevProps.travelTimes
    ) {
      this.updatePath();
    }
  }

  public render() {
    return <InteractiveOverlay />;
  }

  private updatePath() {
    if (!this.props.travelTimes) {
      return;
    }

    const path: string = this.props.travelTimes
      .map((travelTime) => {
        return [
          travelTime.title,
          travelTime.location.title,
          travelTime.location.lat,
          travelTime.location.lng,
          travelTime.duration / 60,
          travelTime.transport,
        ].join(encodingDivider);
      })
      .join("/");

    this.props.history.replace("/" + path);
  }
}

const mapStateToProps = (state: ReduxState) => ({
  travelTimes: state.travelTime.travelTimes,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      getTravelTimes,
    },
    dispatch
  );

export const App = connect<StateProps, DispatchProps, Props, ReduxState>(
  mapStateToProps,
  mapDispatchToProps
)(Component);
