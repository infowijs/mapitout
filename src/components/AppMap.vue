<template>
  <section ref="map"></section>
</template>
<script>
import GoogleMapsApiLoader from "google-maps-api-loader";

import { getDeviceGeoLocation } from "../utils";
import styles from "../style/google-maps";

export const BOUNDARIES_NETHERLANDS = { north: 53.53, south: 50.74, west: 3.35, east: 7.25 };

export default {
  data() {
    return {
      google: null,
      map: null
    };
  },
  async mounted() {
    try {
      this.google = await GoogleMapsApiLoader({ apiKey: process.env.VUE_APP_GOOGLE_API_KEY });
    } catch (error) {
      this.$router.push({ name: "error", params: { error } });
      return;
    }

    const center = await getDeviceGeoLocation();

    this.map = new this.google.maps.Map(this.$refs.map, {
      disableDefaultUI: true,
      zoom: 9,
      minZoom: 9,
      center,
      restriction: {
        latLngBounds: BOUNDARIES_NETHERLANDS
      },
      styles
    });
  }
};
</script>
