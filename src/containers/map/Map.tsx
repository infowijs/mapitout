import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { withGoogleMap, GoogleMap } from "react-google-maps";
import styled, { createGlobalStyle } from "styled-components";
import { Trans, t } from "@lingui/macro";

import {
  ZoomInIcon,
  ZoomOutIcon,
  HelpIcon,
  OndemandVideoIcon,
  FlagIcon,
} from "../../icons";
import {
  ReduxState,
  setZoomLevel,
  setTooltip,
  setFaqVisibility,
  setDemoVisibility,
  setSchoolDetailPin,
} from "../../store";

import { googleMapsStyles } from "../../constants";
import { Markers, Pois, Polygons, SchoolDetailPin, Tooltip } from "./lib";
import { i18n } from "../../index";
import { determineLanguage, setLanguage } from "../../locales/utils";

const GlobalGoogleMapsAttributionOffset = createGlobalStyle`
	@media (max-width: 900px) {
		.gm-style-cc {
			transform: translate(-4.7rem,-5.5rem);
		}
	}
`;

const StyledAttribution = styled.p`
  position: absolute;
  bottom: 1.5rem;
  right: 5.5rem;
  white-space: nowrap;
  font-size: 0.75rem;
  color: #888;

  a {
    color: #4286f4;
    text-decoration: none;
  }

  @media (max-width: 900px) {
    bottom: 7rem;
    right: 5rem;
  }
`;

const StyledControls = styled.div`
  position: absolute;
  z-index: 100;

  @media (min-width: 900px) {
    bottom: 1.5rem;
    right: 1.5rem;
  }

  @media (max-width: 900px) {
    bottom: 4.75rem;
    right: 1rem;
  }
`;

const StyledControlsGroup = styled.div`
  padding: 0.5rem;
  margin-top: 0.5rem;
  background: #fff;
  border-radius: 3px;
`;

const StyledControlsItem = styled.div`
  cursor: pointer;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:not(:first-child) {
    margin-top: 0.5rem;
  }
`;

interface StateProps {
  travelTimes: ReduxState["travelTime"]["travelTimes"];
  tooltip: ReduxState["application"]["tooltip"];
  schoolDetailPin: ReduxState["application"]["schoolDetailPin"];
}
interface DispatchProps {
  setZoomLevel: typeof setZoomLevel;
  setTooltip: typeof setTooltip;
  setFaqVisibility: typeof setFaqVisibility;
  setDemoVisibility: typeof setDemoVisibility;
  setSchoolDetailPin: typeof setSchoolDetailPin;
}
interface Props {}
type PropsUnion = StateProps & DispatchProps & Props;

interface State {}

export class Component extends React.Component<PropsUnion, State> {
  public readonly state: State = {};
  public mapRef = React.createRef<GoogleMap>();

  public setTooltipTimeout: ReturnType<typeof setTimeout> | null = null;

  public shouldComponentUpdate(
    nextProps: Readonly<PropsUnion>,
    nextState: Readonly<State>,
    nextContext: any
  ): boolean {
    if (
      nextProps.travelTimes &&
      nextProps.travelTimes !== this.props.travelTimes
    ) {
      this.animateFitToBounds(nextProps.travelTimes);
    }

    return false;
  }

  public render() {
    const lang = determineLanguage();
    const privacyUrl =
      lang === "nl"
        ? "https://www.amsterdam.nl/privacy/specifieke/privacyverklaringen-wonen/online-mapitout-tool/"
        : "https://www.amsterdam.nl/privacy/specifieke/privacyverklaringen-wonen/online-tool-mapitout/";

    const MapFactory = withGoogleMap((props: any) => (
      <GoogleMap
        ref={this.mapRef}
        defaultZoom={9}
        defaultCenter={{
          lat: 52.3645568,
          lng: 4.8958031,
        }}
        defaultOptions={{
          streetViewControl: false,
          scaleControl: false,
          mapTypeControl: false,
          zoomControl: false,
          rotateControl: false,
          fullscreenControl: false,
          disableDefaultUI: true,
          clickableIcons: false,
          styles: googleMapsStyles,
          gestureHandling: "greedy",
        }}
        onZoomChanged={() =>
          this.props.setZoomLevel(Math.round(this.mapRef.current!.getZoom()))
        }
        onDblClick={() =>
          this.setTooltipTimeout && clearTimeout(this.setTooltipTimeout)
        }
        onClick={(e: any) => {
          if (this.props.tooltip) {
            this.setTooltipTimeout = setTimeout(() => {
              this.props.setTooltip(null);
              this.props.setSchoolDetailPin(null);
            }, 250);
          } else {
            this.setTooltipTimeout = setTimeout(() => {
              if (this.props.schoolDetailPin) {
                this.props.setSchoolDetailPin(null);
                return;
              }
              const location = {
                lat: e.latLng.lat(),
                lng: e.latLng.lng(),
              };
              const geocoder = new google.maps.Geocoder();
              geocoder.geocode({ location }, (results) => {
                const address =
                  (results &&
                    results.length > 0 &&
                    results[0].address_components) ||
                  [];

                const city = address.filter(
                  (a) => a.types.indexOf("locality") !== -1
                )[0];
                const streetName = address.filter(
                  (a) => a.types.indexOf("route") !== -1
                )[0];
                const streetNumber = address.filter(
                  (a) => a.types.indexOf("street_number") !== -1
                )[0];

                const title =
                  (streetName ? streetName.short_name : "") +
                    (streetNumber ? " " + streetNumber.short_name : "") +
                    (city ? ", " + city.short_name : "") ||
                  // @ts-ignore
                  i18n._(t`Somewhere on a boat`);

                this.props.setTooltip({
                  title,
                  lat: location.lat,
                  lng: location.lng,
                });
              });
            }, 250);
          }
        }}
      >
        {this.renderControls()}
        <GlobalGoogleMapsAttributionOffset />
        <StyledAttribution>
          <Trans>Powered by</Trans>{" "}
          <a
            href="https://www.traveltimeplatform.com/"
            rel="noopener noreferrer"
            target="_blank"
          >
            Travel Time
          </a>
          {process.env.REACT_APP_BRANDING ? (
            <>
              {" | "}
              <a href={privacyUrl} rel="noopener noreferrer" target="_blank">
                Privacy policy
              </a>
            </>
          ) : null}
        </StyledAttribution>
        <Markers
          onMarkerClick={(travelTime) => {
            this.animateFitToBounds(travelTime);

            if (this.setTooltipTimeout) {
              clearTimeout(this.setTooltipTimeout);
            }
          }}
        />
        <Pois />
        <SchoolDetailPin />
        <Polygons />
        <Tooltip />
      </GoogleMap>
    ));

    return (
      <MapFactory
        containerElement={
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            }}
          />
        }
        mapElement={<div style={{ height: `100%` }} />}
      />
    );
  }

  private animateFitToBounds = (
    travelTimes: NonNullable<ReduxState["travelTime"]["travelTimes"]>
  ) => {
    if (!this.mapRef.current) {
      return;
    }

    let north = 0;
    let east = 0;
    let south = 99;
    let west = 99;

    for (const coordinate of travelTimes
      .map((v) => v.res.shapes.map((s) => s.shell))
      .flat(2)) {
      north = Math.max(north, coordinate.lat);
      east = Math.max(east, coordinate.lng);
      south = Math.min(south, coordinate.lat);
      west = Math.min(west, coordinate.lng);
    }

    const zoomLevel = Math.min(
      getBoundsZoomLevel(
        new google.maps.LatLngBounds(
          { lat: south, lng: west },
          { lat: north, lng: east }
        ),
        {
          width: window.innerWidth,
          height: window.innerHeight,
        }
      ),
      12
    );

    if (this.mapRef.current.getZoom() !== zoomLevel) {
      this.zoomTo(
        this.mapRef.current.getZoom(),
        zoomLevel,
        this.mapRef.current.getZoom() > zoomLevel ? "out" : "in"
      );
    }

    this.mapRef.current.panTo({
      lat: (north + south) / 2,
      lng: (east + west) / 2,
    });
  };

  private renderControls() {
    const newLanguage = determineLanguage() === "nl" ? "en" : "nl";

    return (
      <StyledControls>
        {process.env.REACT_APP_BRANDING ? (
          <>
            <StyledControlsGroup>
              <StyledControlsItem
                onClick={() => this.props.setFaqVisibility(true)}
              >
                <HelpIcon />
              </StyledControlsItem>
            </StyledControlsGroup>
            <StyledControlsGroup>
              <StyledControlsItem
                onClick={() => this.props.setDemoVisibility(true)}
              >
                <OndemandVideoIcon />
              </StyledControlsItem>
            </StyledControlsGroup>
          </>
        ) : null}
        <StyledControlsGroup>
          <StyledControlsItem onClick={() => setLanguage(newLanguage)}>
            <FlagIcon language={newLanguage} />
          </StyledControlsItem>
        </StyledControlsGroup>
        <StyledControlsGroup>
          <StyledControlsItem onClick={() => this.zoom("in")}>
            <ZoomInIcon />
          </StyledControlsItem>
          <StyledControlsItem onClick={() => this.zoom("out")}>
            <ZoomOutIcon />
          </StyledControlsItem>
        </StyledControlsGroup>
      </StyledControls>
    );
  }

  private zoom = (zoomDirection: "in" | "out") => {
    if (!this.mapRef.current) {
      return;
    }
    const currentZoom = this.mapRef.current.getZoom();
    if (currentZoom < 7 && currentZoom > 15) {
      return;
    }
    this.zoomTo(
      currentZoom,
      zoomDirection === "in" ? currentZoom + 1 : currentZoom - 1,
      zoomDirection
    );
  };

  private zoomTo = (
    currentZoom: number,
    endStop: number,
    zoomDirection: "in" | "out"
  ) => {
    if (
      !this.mapRef.current ||
      (zoomDirection === "in" && currentZoom >= endStop) ||
      (zoomDirection === "out" && currentZoom <= endStop)
    ) {
      return;
    }

    const nextZoom =
      Math.round((currentZoom + (zoomDirection === "in" ? +0.2 : -0.2)) * 10) /
      10;

    this.mapRef.current.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.setZoom(
      nextZoom
    );

    setTimeout(() => {
      this.zoomTo(nextZoom, endStop, zoomDirection);
    }, 25);
  };
}

function getBoundsZoomLevel(
  bounds: google.maps.LatLngBounds,
  mapDim: { width: number; height: number }
): number {
  const WORLD_DIM = { height: 256, width: 256 };
  const ZOOM_MAX = 21;

  function latRad(lat: number) {
    const sin = Math.sin((lat * Math.PI) / 180);
    const radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
    return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
  }

  function zoom(mapPx: number, worldPx: number, fraction: number) {
    return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
  }

  const ne = bounds.getNorthEast();
  const sw = bounds.getSouthWest();

  const latFraction = (latRad(ne.lat()) - latRad(sw.lat())) / Math.PI;

  const lngDiff = ne.lng() - sw.lng();
  const lngFraction = (lngDiff < 0 ? lngDiff + 360 : lngDiff) / 360;

  const latZoom = zoom(mapDim.height, WORLD_DIM.height, latFraction);
  const lngZoom = zoom(mapDim.width, WORLD_DIM.width, lngFraction);

  return Math.min(latZoom, lngZoom, ZOOM_MAX);
}

const mapStateToProps = (state: ReduxState) => ({
  travelTimes: state.travelTime.travelTimes,
  tooltip: state.application.tooltip,
  schoolDetailPin: state.application.schoolDetailPin,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      setZoomLevel,
      setTooltip,
      setFaqVisibility,
      setDemoVisibility,
      setSchoolDetailPin,
    },
    dispatch
  );

export const Map = connect<StateProps, DispatchProps, Props, ReduxState>(
  mapStateToProps,
  mapDispatchToProps
)(Component);
