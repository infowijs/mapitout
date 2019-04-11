<template>
  <section class="map" ref="map"></section>
</template>
<script>
import GoogleMapsApiLoader from "google-maps-api-loader";

import { getDeviceGeoLocation } from "../utils";
import styles from "../style/google-maps";
import { mapGetters, mapState, mapActions } from "vuex";
import { isEqual } from "lodash-es";

export default {
  data() {
    return {
      google: null,
      map: null,
      fullCoverage: null,
      areaCoverages: [],
      originMarkers: [],
      intersectionPaths: [],
      poiMarkers: []
    };
  },
  computed: {
    ...mapGetters("locations", ["getLocationTypeByValue", "getLocationTypeById"]),
    ...mapState("areas", ["mapBoundaries", "areas"]),
    ...mapState("locations", ["pois"]),
    ...mapState("ranges", {
      ranges: "ranges",
      activeRangeId: state => state.activeId
    }),

    maskPath: function() {
      return [
        { lat: this.mapBoundaries.north + 5, lng: this.mapBoundaries.west - 5 },
        { lat: this.mapBoundaries.north + 5, lng: this.mapBoundaries.east + 5 },
        { lat: this.mapBoundaries.south - 5, lng: this.mapBoundaries.east + 5 },
        { lat: this.mapBoundaries.south - 5, lng: this.mapBoundaries.west - 5 }
      ];
    }
  },
  watch: {
    areas: function() {
      if (this.google && this.map) {
        this.drawOrigins();
        this.drawCoverage();
      }
    },

    activeRangeId: function(activeRangeId) {
      this.areaCoverages.forEach(({ rangeId, areaCoverage }) => {
        if (rangeId === activeRangeId) {
          areaCoverage.setOptions({
            fillOpacity: 0.2
          });
        } else {
          areaCoverage.setOptions({
            fillOpacity: 0
          });
        }
      });
    },

    ranges: function() {
      if (this.google && this.map) {
        this.drawOrigins();
        this.drawCoverage();
      }
    },

    pois: function(newValue, oldValue) {
      if (!isEqual(newValue, oldValue)) {
        this.drawPois();
      }
    }
  },

  async mounted() {
    const googleApi = await this.initGoogleApi();

    if (googleApi) {
      this.google = googleApi;
      this.map = await this.initGoogleMaps(googleApi);

      if (this.areas.length > 0) {
        this.drawOrigins();
        this.drawCoverage();
      }
    }
  },

  methods: {
    ...mapActions("ranges", {
      activateRange: "activate"
    }),

    ...mapActions(["reportError"]),

    async initGoogleApi() {
      try {
        return await GoogleMapsApiLoader({ apiKey: process.env.VUE_APP_GOOGLE_API_KEY });
      } catch (error) {
        this.reportError(error);
        return null;
      }
    },

    async initGoogleMaps(googleApi) {
      const center = await getDeviceGeoLocation();

      return new googleApi.maps.Map(this.$refs.map, {
        disableDefaultUI: true,
        zoom: 9,
        minZoom: 9,
        center,
        restriction: {
          latLngBounds: this.mapBoundaries
        },
        styles
      });
    },

    drawOrigins() {
      this.cleanOrigins();

      this.originMarkers = this.ranges
        .filter(range => range.originLat && range.originLng)
        .map(range => {
          return new this.google.maps.Marker({
            position: {
              lat: range.originLat,
              lng: range.originLng
            },
            title: range.originAddress,
            icon: this.getLocationTypeByValue(range.originType).icon,
            map: this.map
          });
        });
    },

    drawCoverage() {
      this.cleanCoverage();

      this.areas.forEach(area => {
        switch (area.rangeId) {
          case "union":
            this.fullCoverage = this.drawUnion(area);
            break;
          case "intersection":
            this.intersectionPaths = this.drawIntersections(area);
            break;
          default:
            this.areaCoverages.push({ rangeId: area.rangeId, areaCoverage: this.drawArea(area) });
        }
      });
    },

    drawUnion(area) {
      let union = null;

      if (area.paths.length >= 1) {
        union = new this.google.maps.Polygon({
          paths: [this.maskPath, ...area.paths],
          strokeColor: "#000000",
          strokeOpacity: 1,
          strokeWeight: 2,
          fillColor: "#4d4d4d",
          fillOpacity: 0.4,
          map: this.map
        });
      }

      return union;
    },

    drawIntersections(area) {
      let intersectionPaths = [];

      if (this.areas.filter(area => !["union", "intersection"].includes(area.rangeId)).length > 1) {
        intersectionPaths = area.paths.map(
          intersectionPath =>
            new this.google.maps.Polyline({
              path: intersectionPath,
              strokeColor: "#000000",
              strokeOpacity: 1,
              fillOpacity: 0,
              strokeWeight: 0,
              icons: [
                {
                  icon: {
                    path: this.google.maps.SymbolPath.CIRCLE,
                    fillOpacity: 1,
                    scale: 1
                  },
                  offset: "0",
                  repeat: "10px"
                }
              ],
              map: this.map
            })
        );
      }

      return intersectionPaths;
    },

    drawArea(area) {
      const range = this.ranges.find(range => range.id === area.rangeId);
      const rangeType = this.getLocationTypeByValue(range.originType);
      const areaCoverage = new this.google.maps.Polygon({
        paths: [...area.paths],
        strokeOpacity: 0,
        strokeWeight: 0,
        fillColor: rangeType.highlightColor,
        fillOpacity: area.rangeId === this.activeRangeId ? 0.2 : 0,
        map: this.map
      });

      areaCoverage.addListener("mouseover", () => {
        areaCoverage.setOptions({
          fillOpacity: area.rangeId === this.activeRangeId ? 0.2 : 0
        });
      });

      areaCoverage.addListener("mouseout", () => {
        areaCoverage.setOptions({
          fillOpacity: area.rangeId === this.activeRangeId ? 0.2 : 0
        });
      });

      areaCoverage.addListener("click", () => {
        this.activateRange(area.rangeId);
      });

      return areaCoverage;
    },

    drawPois() {
      this.cleanPois();

      this.poiMarkers = this.pois.map(poi => {
        const position = poi.geo_location.coordinates.reduce((acc, coordinate, index) => {
          if (index === 1) {
            acc.lat = coordinate;
          } else {
            acc.lng = coordinate;
          }

          return acc;
        }, {});

        return new this.google.maps.Marker({
          position,
          title: poi.name,
          icon: this.getLocationTypeById(poi.poi_type_id).icon,
          map: this.map
        });
      });
    },

    cleanOrigins() {
      this.originMarkers.forEach(marker => {
        marker.setMap(null);
      });

      this.originMarkers = [];
    },

    cleanCoverage() {
      if (this.fullCoverage) {
        this.fullCoverage.setMap(null);
        this.fullCoverage = null;
      }

      this.intersectionPaths = this.intersectionPaths.reduce((acc, polyline) => {
        polyline.setMap(null);
        return acc;
      }, []);

      this.areaCoverages = this.areaCoverages.reduce((acc, { areaCoverage }) => {
        areaCoverage.setMap(null);
        return acc;
      }, []);
    },

    cleanPois() {
      this.poiMarkers = this.poiMarkers.reduce((acc, marker) => {
        marker.setMap(null);

        return acc;
      }, []);
    }
  }
};
</script>
