<template>
  <div class="range" :class="{ disabled: isDisabled }">
    <div class="origin">
      <location
        class="input"
        v-model="origin"
        :isDisabled="isDisabled"
        :types="originTypes"
        :lookup-address="lookupAddress"
        @input="onLocationInput"
      />
    </div>
    <div class="transport">
      <transport-type
        class="input"
        :isDisabled="isDisabled"
        v-model="transportTypeId"
        :options="transportTypes"
        @input="onTransportTypeInput"
      />
    </div>
    <div class="time">
      <travel-time
        class="input"
        :isDisabled="isDisabled"
        v-model="travelTime"
        @input="onTravelTimeInput"
      />
    </div>
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

  > * {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 80px;
    padding: 0 36px;

    .input {
      flex-grow: 1;
    }
  }

  &.disabled {
    padding: 0 36px;
  }
}

.origin {
  z-index: 2;
  background-color: $greyscale-2;
  order: 2;

  .disabled & {
    background-color: transparent;
    padding: 0;
  }
}

.transport {
  z-index: 1;
  background-color: $greyscale-2;
  order: 3;

  .disabled & {
    background-color: transparent;
    margin-left: 8px;
    padding: 0;
  }
}

.time {
  z-index: 1;
  background-color: darken($greyscale-2, 10);
  order: 4;

  .disabled & {
    background-color: transparent;
    margin-left: 4px;
    padding: 0;
  }
}
</style>
<script>
import Location from "../Location";
import TransportType from "../TransportType";
import TravelTime from "./TravelTime";
import { mapActions, mapState } from "vuex";

export default {
  components: {
    Location,
    TransportType,
    TravelTime
  },
  props: {
    value: {
      type: Object,
      default: () => ({
        travelTime: 45,
        transportTypeId: 0,
        departureTime: new Date().toISOString(),
        originTypeId: 0,
        originId: "",
        origin: ""
      })
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      transportTypeId: this.value.transportTypeId,
      travelTime: this.value.travelTime,
      origin: {
        typeId: this.value.originTypeId,
        addressId: this.value.originId,
        address: this.value.origin
      }
    };
  },
  computed: {
    ...mapState("origins", {
      originTypes: state => state.types
    }),
    ...mapState("transports", {
      transportTypes: state => state.types
    })
  },
  watch: {
    value: function(value) {
      this.transportTypeId = this.value.transportTypeId;
      this.travelTime = this.value.travelTime;

      this.origin = {
        typeId: value.originTypeId,
        addressId: value.originId,
        address: value.origin
      };
    }
  },
  methods: {
    ...mapActions("origins", {
      lookupAddress: "lookup"
    }),

    onLocationInput(origin) {
      this.$emit("input", {
        ...this.value,
        originTypeId: origin.typeId,
        originId: origin.addressId,
        origin: origin.address
      });
    },

    onTransportTypeInput(transportTypeId) {
      this.$emit("input", { ...this.value, transportTypeId });
    },

    onTravelTimeInput(travelTime) {
      this.$emit("input", {
        ...this.value,
        travelTime,
        departureTime: this.getDepartureTime(new Date()).toISOString()
      });
    },

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
