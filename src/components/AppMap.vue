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
      detailsMarker: null,
      originMarkers: [],
      poiMarkers: [],
      unionPolygon: null,
      intersectionPolylines: [],
      rangePolygons: []
    };
  },
  computed: {
    ...mapGetters("pois", ["getPoiIconByPoiTypeId"]),
    ...mapGetters("origins", [
      "getOriginById",
      "getOriginIconByOriginTypeId",
      "getOriginHighlightColorByOriginTypeId"
    ]),
    ...mapState("areas", ["mapBoundaries", "areas"]),
    ...mapState("pois", ["pois"]),
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
    areas: function(areas) {
      if (this.google && this.map) {
        this.drawAreas(areas);
      }
    },

    ranges: function(ranges) {
      if (this.google && this.map) {
        this.updateAreas(ranges);
      }
    },

    activeRangeId: function(activeRangeId) {
      this.rangePolygons.forEach(({ rangeId, polygon }) => {
        if (rangeId === activeRangeId) {
          polygon.setOptions({
            fillOpacity: 0.2
          });
        } else {
          polygon.setOptions({
            fillOpacity: 0
          });
        }
      });
    },

    pois: function(newValue, oldValue) {
      if (!isEqual(newValue, oldValue)) {
        this.drawPois(newValue);
      }
    }
  },

  async mounted() {
    const googleApi = await this.initGoogleApi();

    if (googleApi) {
      this.google = googleApi;
      this.map = await this.initGoogleMaps(googleApi);

      this.drawAreas(this.areas, this.ranges);
      this.drawPois(this.pois);
    }
  },

  methods: {
    ...mapActions("ranges", {
      activateRange: "activate"
    }),

    ...mapActions("errors", {
      genericError: "generic"
    }),

    async initGoogleApi() {
      try {
        return await GoogleMapsApiLoader({ apiKey: process.env.VUE_APP_GOOGLE_API_KEY });
      } catch (error) {
        this.genericError(error);
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

    drawAreas(areas) {
      if (this.unionPolygon) {
        this.unionPolygon.setMap(null);
      }

      this.intersectionPolylines.map(polyline => {
        polyline.setMap(null);
      });

      this.rangePolygons.map(({ polygon }) => {
        polygon.setMap(null);
      });

      this.unionPolygon = this.createUnionPolygon(areas.find(area => area.id === "union"));

      if (this.unionPolygon) {
        this.unionPolygon.setMap(this.map);
      }

      this.originMarkers.forEach(originMarker => {
        originMarker.marker.setMap(null);
      });

      this.intersectionPolylines = this.createIntersectionPolylines(
        areas.find(area => area.id === "intersection")
      ).map(polyline => {
        polyline.setMap(this.map);

        return polyline;
      });

      this.rangePolygons = areas
        .filter(area => !["intersection", "union"].includes(area.id))
        .map(area => this.createRangePolygon(area))
        .map(rangePolygon => {
          rangePolygon.polygon.setMap(this.map);

          return rangePolygon;
        });

      this.originMarkers = areas
        .filter(area => !["intersection", "union"].includes(area.id))
        .map(area => this.ranges.find(range => range.id === area.rangeId))
        .filter(range => range)
        .map(range => this.createOriginMarker(range))
        .filter(origin => origin)
        .map(originMarker => {
          originMarker.marker.setMap(this.map);

          return originMarker;
        });
    },

    updateAreas(ranges) {
      ranges.forEach(range => {
        const rangePolygon = this.rangePolygons.find(
          rangePolygon => rangePolygon.rangeId === range.id
        );

        if (rangePolygon) {
          rangePolygon.polygon.setOptions({
            fillColor: this.getOriginHighlightColorByOriginTypeId(range.originTypeId)
          });
        }

        const originMarker = this.originMarkers.find(
          originMarker => originMarker.rangeId === range.id
        );

        if (originMarker) {
          originMarker.marker.setIcon({
            url: this.getOriginIconByOriginTypeId(range.originTypeId),
            scaledSize: new this.google.maps.Size(24, 24)
          });
        }
      });
    },

    drawPois(pois) {
      this.poiMarkers.forEach(marker => {
        marker.setMap(null);
      });

      this.poiMarkers = pois
        .map(poi => this.createPoiMarker(poi))
        .map(poiMarker => {
          poiMarker.setMap(this.map);

          return poiMarker;
        });
    },

    createUnionPolygon(unionArea) {
      let unionPolygon = null;

      if (unionArea && unionArea.paths.length > 0) {
        unionPolygon = new this.google.maps.Polygon({
          paths: [this.maskPath, ...unionArea.paths],
          strokeColor: "#000000",
          strokeOpacity: 1,
          strokeWeight: 2,
          fillColor: "#4d4d4d",
          fillOpacity: 0.4
        });
      }

      return unionPolygon;
    },

    createIntersectionPolylines(intersectionArea) {
      let intersectionPolylines = [];

      if (intersectionArea && intersectionArea.paths.length > 0) {
        intersectionPolylines = intersectionArea.paths.map(
          path =>
            new this.google.maps.Polyline({
              path: path,
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
              ]
            })
        );
      }

      return intersectionPolylines;
    },

    createRangePolygon(area) {
      if (area && area.paths.length > 0) {
        const range = this.ranges.find(range => range.id === area.rangeId);
        const highlightColor = this.getOriginHighlightColorByOriginTypeId(range.originTypeId);

        const polygon = new this.google.maps.Polygon({
          paths: [...area.paths],
          strokeOpacity: 0,
          strokeWeight: 0,
          fillColor: highlightColor,
          fillOpacity: range.id === this.activeRangeId ? 0.2 : 0
        });

        polygon.addListener("mouseover", () => {
          polygon.setOptions({
            fillOpacity: range.id === this.activeRangeId ? 0.2 : 0
          });
        });

        polygon.addListener("mouseout", () => {
          polygon.setOptions({
            fillOpacity: range.id === this.activeRangeId ? 0.2 : 0
          });
        });

        polygon.addListener("click", () => {
          this.activateRange(range.id);
        });

        return { rangeId: range.id, polygon };
      }
    },

    createOriginMarker(range) {
      let originMarker;

      const origin = this.getOriginById(range.originId);

      if (origin) {
        const marker = new this.google.maps.Marker({
          position: {
            lat: origin.lat,
            lng: origin.lng
          },
          title: range.originAddress,
          icon: {
            url: this.getOriginIconByOriginTypeId(range.originTypeId),
            scaledSize: new this.google.maps.Size(24, 24)
          }
        });

        marker.addListener("click", () => {
          this.activateRange(range.id);
        });

        originMarker = { rangeId: range.id, marker };
      }

      return originMarker;
    },

    createPoiMarker(poi) {
      const poiMarker = new this.google.maps.Marker({
        position: {
          lat: poi.geo_location.coordinates[1],
          lng: poi.geo_location.coordinates[0]
        },
        title: poi.name,
        icon: {
          url: this.getPoiIconByPoiTypeId(poi.poi_type_id),
          scaledSize: new this.google.maps.Size(24, 24)
        }
      });

      poiMarker.addListener("click", () => {
        this.$router.push({
          path: `/details/${poi.name}`,
          query: { ...this.$route.query }
        });
      });

      return poiMarker;
    }
  }
};
</script>
