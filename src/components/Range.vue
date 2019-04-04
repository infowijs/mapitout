<template>
  <div class="range" :class="{ disabled: isDisabled }">
    <location-input class="location" :isDisabled="isDisabled" v-model="origin" />
    <transport-type class="transport-type" :isDisabled="isDisabled" v-model="transportType" />
    <travel-time class="travel-time" :isDisabled="isDisabled" v-model="travelTime" />
  </div>
</template>
<style scoped lang="scss">
@import "../style/variables";

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
import LocationInput from "./input/LocationInput";
import TransportType from "./input/TransportType";
import TravelTime from "./input/TravelTime";
import { mapState } from "vuex";

export default {
  props: {
    value: {
      type: Object,
      default: function() {
        return {
          departureTime: new Date(),
          travelTime: 45,
          transportType: "public_transport",
          originType: "home",
          originId: undefined,
          originAddress: undefined,
          originCoordinates: null,
          highlightColor: "#ff0000"
        };
      }
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      travelTime: this.value.travelTime,
      transportType: this.value.transportType,
      highlightColor: this.value.highlightColor,
      departureTime: this.value.departureTime,
      origin: {
        type: this.value.originType,
        addressId: this.value.originId,
        address: this.value.originAddress,
        coordinates: this.value.originCoordinates
      }
    };
  },
  computed: {
    ...mapState("locations", {
      originTypes: state => state.types
    })
  },
  components: {
    LocationInput,
    TransportType,
    TravelTime
  },
  watch: {
    origin: function(origin) {
      this.$emit("input", {
        ...this.value,
        originType: origin.type,
        originId: origin.addressId,
        originAddress: origin.address,
        originCoordinates: origin.coordinates,
        highlightColor: this.originTypes.find(type => type.value === origin.type).highlightColor,
        departureTime: this.getDepartureTime(new Date())
      });
    },

    transportType: function(transportType) {
      this.$emit("input", { ...this.value, transportType });
    },

    travelTime: function(travelTime) {
      this.$emit("input", { ...this.value, travelTime });
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
