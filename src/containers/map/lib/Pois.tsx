import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { Marker } from "react-google-maps";
import MarkerClusterer from "react-google-maps/lib/components/addons/MarkerClusterer";
import { createGlobalStyle } from "styled-components";
import { v4 as uuidv4 } from "uuid";

import { ReduxState, setSchoolDetailPin, setTooltip } from "../../../store";

import iconPrimary from "../../../assets/primary.svg";
import iconSecondary from "../../../assets/secondary.svg";
import iconMixed from "../../../assets/mixed.svg";
import iconCluster from "../../../assets/cluster.svg";

import addresses from "../../../assets/schools.json";

import { Address } from "../../../interfaces";

const ClusterMarkerGlobalStyles = createGlobalStyle`
	.cluster {
		position: relative;
		z-index: 0;
		
		@media (min-width: 900px) {		
			:after {
				content: '';
				position: absolute;
				width: 60px;
				height: 60px;
				border-radius: 999px;
				z-index: -1;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				background: radial-gradient(rgba(255, 255, 255, .75) 0%, transparent 75%);
				opacity: .5;
				transition: 100ms;
			}
			
			:hover:after {
				width: 80px;
				height: 80px;
				opacity: 1;
			}
		}
	}
	.cluster-marker-text-container {
		text-align: left;
		
		p {
			display: inline;
			padding: 2px 6px;
			border-radius: 99px;
			text-align: left;
			background-color: #26AFB6;
		}
	}
`;

interface StateProps {
  zoom: ReduxState["application"]["zoom"];
  primaryEducationVisible: ReduxState["application"]["primaryEducationVisible"];
  secondaryEducationVisible: ReduxState["application"]["secondaryEducationVisible"];
  onlyInternationalVisibility: ReduxState["application"]["onlyInternationalVisibility"];
}
interface DispatchProps {
  setSchoolDetailPin: typeof setSchoolDetailPin;
  setTooltip: typeof setTooltip;
}
interface Props {}
type PropsUnion = StateProps & DispatchProps & Props;

interface State {
  addresses: Array<Address & { id: string }>;
  availableAddresses: SimplifiedAddress[] | null;
}

type SimplifiedAddress = Pick<Address, "lat"> &
  Pick<Address, "lng"> & {
    id: string;
    visible: boolean;
    style: string;
  };

const zoomLevelTolerance = 12;
export class Component extends React.Component<PropsUnion, State> {
  constructor(props: PropsUnion) {
    super(props);

    this.state = {
      addresses: addresses.map((address) => ({
        id: uuidv4(),
        ...address,
      })),
      availableAddresses: null,
    };
  }

  public shouldComponentUpdate(
    nextProps: Readonly<PropsUnion>,
    nextState: Readonly<State>,
    nextContext: any
  ): boolean {
    if (this.state.availableAddresses !== nextState.availableAddresses) {
      return true;
    }

    if (
      this.props.primaryEducationVisible !==
        nextProps.primaryEducationVisible ||
      this.props.secondaryEducationVisible !==
        nextProps.secondaryEducationVisible ||
      this.props.onlyInternationalVisibility !==
        nextProps.onlyInternationalVisibility
    ) {
      this.setState({
        availableAddresses: this.getFilteredAddresses(
          nextProps.primaryEducationVisible,
          nextProps.secondaryEducationVisible,
          nextProps.onlyInternationalVisibility
        ),
      });
    }

    return !(
      this.props.zoom === nextProps.zoom ||
      (this.props.zoom >= zoomLevelTolerance &&
        nextProps.zoom >= zoomLevelTolerance) ||
      (this.props.zoom < zoomLevelTolerance &&
        nextProps.zoom < zoomLevelTolerance)
    );
  }

  private trim = (
    addresses: Array<State["addresses"][0] & { visible: boolean }>
  ): SimplifiedAddress[] =>
    addresses.map((address) => {
      const numberOfSchools = address.schools.length;
      const numberOfPrimaryOnlySchools = address.schools.filter(
        (school) => school.type === "primary"
      ).length;
      const numberOfSecondaryOnlySchools = address.schools.filter(
        (school) => school.type === "secondary"
      ).length;
      let style: string;

      if (numberOfSchools === numberOfPrimaryOnlySchools) {
        style = "primary";
      } else if (numberOfSchools === numberOfSecondaryOnlySchools) {
        style = "secondary";
      } else {
        style = "mixed";
      }

      return {
        id: address.id,
        lat: address.lat,
        lng: address.lng,
        visible: address.visible,
        style,
      };
    });

  private getFilteredAddresses = (
    primaryEducationVisible: boolean,
    secondaryEducationVisible: boolean,
    onlyInternationalVisibility: boolean
  ): SimplifiedAddress[] => {
    let availableAddresses = [...this.state.addresses].map((address) => ({
      ...address,
      visible: !(!primaryEducationVisible && !secondaryEducationVisible),
    }));

    if (!primaryEducationVisible && !secondaryEducationVisible) {
      return this.trim(availableAddresses);
    }

    if (onlyInternationalVisibility) {
      for (const address of availableAddresses) {
        if (!address.schools.find((school) => school.international)) {
          address.visible = false;
        }
      }
    }

    if (primaryEducationVisible && secondaryEducationVisible) {
      return this.trim(availableAddresses);
    }

    for (const address of availableAddresses) {
      if (address.visible) {
        address.visible = !!address.schools.find((school) =>
          [primaryEducationVisible ? "primary" : "secondary", "mixed"].includes(
            school.type
          )
        );
      }
    }

    return this.trim(availableAddresses);
  };

  public render() {
    const { zoom } = this.props;
    const { availableAddresses } = this.state;

    return (
      <>
        <ClusterMarkerGlobalStyles />
        {availableAddresses && availableAddresses.length > 0 && (
          <MarkerClusterer
            averageCenter
            enableRetinaIcons
            ignoreHidden
            gridSize={120}
            maxZoom={14}
            calculator={(markers: any[], numStyles: number) => {
              return {
                text: `
								<div class='cluster-marker-text-container'>
									<p>${markers.length <= 10 ? markers.length : "10+"}</p>
								</div>
							`,
                index: Math.min(0, numStyles),
                title: "",
              };
            }}
            styles={[
              {
                textColor: "#fff",
                url: iconCluster,
                height: 30,
                width: 30,
                anchorText: [-15, 20],
              },
            ]}
          >
            {availableAddresses.map((address) => {
              let icon;

              switch (address.style) {
                case "primary":
                  icon = iconPrimary;
                  break;
                case "secondary":
                  icon = iconSecondary;
                  break;
                case "mixed":
                  icon = iconMixed;
                  break;
              }

              return (
                <Marker
                  key={address.id}
                  visible={zoom >= zoomLevelTolerance && address.visible}
                  position={{
                    lat: address.lat,
                    lng: address.lng,
                  }}
                  icon={icon}
                  onClick={(e) => {
                    const addr = this.state.addresses.find(
                      (addr) => addr.id === address.id
                    );

                    if (addr) {
                      this.props.setSchoolDetailPin(addr);
                      this.props.setTooltip(null);
                    }
                  }}
                />
              );
            })}
          </MarkerClusterer>
        )}
      </>
    );
  }
}

const mapStateToProps = (state: ReduxState) => ({
  zoom: state.application.zoom,
  primaryEducationVisible: state.application.primaryEducationVisible,
  secondaryEducationVisible: state.application.secondaryEducationVisible,
  onlyInternationalVisibility: state.application.onlyInternationalVisibility,
});
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      setSchoolDetailPin,
      setTooltip,
    },
    dispatch
  );

export const Pois = connect<StateProps, DispatchProps, Props, ReduxState>(
  mapStateToProps,
  mapDispatchToProps
)(Component);
