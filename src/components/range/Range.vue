<template>
  <div class="range" :class="{ disabled: isDisabled }">
    <location-input class="location" :isDisabled="isDisabled" v-model="origin" />
    <transport-type class="transport-type" :isDisabled="isDisabled" v-model="transportType" />
    <travel-time class="travel-time" :isDisabled="isDisabled" v-model="travelTime" />
  </div>
</template>
<style scoped lang="scss">
@import "../../style/variables";

.range {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: normal;
  padding: 0;
  cursor: default;
}

.location::v-deep {
  z-index: 2;
  background-color: $greyscale-2;
  padding: 24px 48px;
  order: 2;

  .disabled & {
    background-color: transparent;
    padding: 0;
  }
}

.transport-type::v-deep {
  z-index: 1;
  background-color: $greyscale-2;
  padding: 24px 48px;
  order: 3;

  .disabled & {
    background-color: transparent;
    margin-left: 8px;
    padding: 0;
  }
}

.travel-time::v-deep {
  z-index: 1;
  background-color: $greyscale-2;
  padding: 24px 48px;
  order: 4;

  .disabled & {
    background-color: transparent;
    margin-left: 4px;
    padding: 0;
  }
}
</style>
<script>
import LocationInput from "../input/LocationInput";
import TransportType from "../input/TransportType";
import TravelTime from "../input/TravelTime";

export default {
  props: {
    range: {
      type: Object,
      required: true
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      travelTime: this.range.travelTime,
      transportType: this.range.transportType,
      departureTime: this.range.departureTime,
      origin: {
        type: this.range.originType,
        addressId: this.range.originId,
        address: this.range.originAddress,
        coordinates: {
          lat: this.range.originLat,
          lng: this.range.originLng
        }
      }
    };
  },
  components: {
    LocationInput,
    TransportType,
    TravelTime
  },
  watch: {
    origin: function(origin) {
      this.$emit("change", {
        ...this.range,
        originType: origin.type,
        originId: origin.addressId,
        originAddress: origin.address,
        originLat: origin.coordinates ? origin.coordinates.lat : null,
        originLng: origin.coordinates ? origin.coordinates.lng : null,
        departureTime: this.getDepartureTime(new Date()).toISOString()
      });
    },

    transportType: function(transportType) {
      this.$emit("change", { ...this.range, transportType });
    },

    travelTime: function(travelTime) {
      this.$emit("change", { ...this.range, travelTime });
    }
  },
  methods: {
    getDepartureTime(date) {
      const dayOfWeek = date.getUTCDay();

      if (dayOfWeek !== 1) {
        const dayOfMonth = date.getUTCDate();

        date.setUTCDate(dayOfMonth - dayOfWeek + 8);
      }

      date.setUTCHours(9, 0, 0, 0);

      return date;
    }
  }
};
</script>
