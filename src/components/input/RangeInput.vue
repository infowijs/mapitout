<template>
  <div ref="root" class="range" :class="{ active: isActive }" @click="onRootClick">
    <location-input class="location" :isDisabled="!isActive" v-model="location" />
    <transport-type class="transport-type" :isDisabled="!isActive" v-model="transportType" />
    <travel-time class="travel-time" :isDisabled="!isActive" v-model="travelTime" />
  </div>
</template>
<style scoped lang="scss">
@import "../../style/variables";

.range {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 48px;
  background-color: white;
  height: 76px;
  cursor: pointer;
  /*transition: height 0.5s ease-in-out, background-color 0.5s ease-in-out;*/
  overflow: hidden;

  > * {
    padding: 0;
  }

  &.active {
    flex-direction: column;
    align-items: stretch;
    justify-content: unset;
    padding: 0;
    cursor: default;
    height: 230px;

    > * {
      padding: 24px 48px;
    }
  }
}

.location::v-deep {
  background-color: transparent;
  flex-basis: 60%;

  .active & {
    z-index: 2;
    background-color: $greyscale-2;
  }
}

.transport-type::v-deep {
  background-color: transparent;
  margin-left: auto;

  .active & {
    margin-left: unset;
    z-index: 1;
    background-color: $greyscale-2;
  }
}

.travel-time::v-deep {
  z-index: 1;
  background-color: white;
  margin-left: 4px;

  .active & {
    margin-left: unset;
    background-color: lighten($greyscale-1, 55);
  }
}
</style>
<script>
import LocationInput from "./LocationInput";
import TransportType from "./TransportType";
import TravelTime from "./TravelTime";

export default {
  props: {
    value: {
      type: Object,
      default: function() {
        return {
          type: "home",
          origin: null,
          transportType: "public",
          travelTime: 45
        };
      }
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      location: {
        type: this.value.type,
        address: this.value.origin
      },
      transportType: this.value.transportType,
      travelTime: this.value.travelTime
    };
  },
  components: {
    LocationInput,
    TransportType,
    TravelTime
  },
  watch: {
    location: function(location) {
      this.$emit("input", { ...this.value, type: location.type, origin: location.address });
    },
    transportType: function(transportType) {
      this.$emit("input", { ...this.value, transportType });
    },
    travelTime: function(travelTime) {
      this.$emit("input", { ...this.value, travelTime });
    }
  },
  methods: {
    onRootClick() {
      this.$emit("focus");
    }
  }
};
</script>
