<template>
  <div ref="root" class="range" :class="{ active: isActive }">
    <location class="location" :isDisabled="!isActive" v-model="location" />
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
  padding: 24px 48px;

  > * {
    padding: 0;
  }

  &.active {
    flex-direction: column;
    align-items: stretch;
    justify-content: unset;
    padding: 0;

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

  .active & {
    z-index: 1;
    background-color: $greyscale-2;
  }
}

.travel-time::v-deep {
  .active & {
    z-index: 1;
    background-color: transparent;

    .active & {
      background-color: rgba($greyscale-1, 0.11);
    }
  }
}
</style>
<script>
import Location from "./Location";
import TransportType from "./TransportType";
import TravelTime from "./TravelTime";

export default {
  props: {
    value: Object,
    isActive: Boolean
  },
  data() {
    return {
      location: this.value ? this.value.location : null,
      transportType: this.value ? this.value.transportType : "public",
      travelTime: this.value ? this.value.travelTime : 30
    };
  },
  components: {
    Location,
    TransportType,
    TravelTime
  },
  watch: {
    location: function(location) {
      const currentValue = this.value ? this.value : {};
      this.setValue({ ...currentValue, location });
    },
    transportType: function(transportType) {
      const currentValue = this.value ? this.value : {};
      this.setValue({ ...currentValue, transportType });
    },
    travelTime: function(travelTime) {
      const currentValue = this.value ? this.value : {};
      this.setValue({ ...currentValue, travelTime });
    }
  },
  mounted() {
    this.$refs.root.addEventListener("click", this.onRootClick);
  },
  methods: {
    onRootClick() {
      this.$emit("focus");
    },
    setValue(newValue) {
      this.$emit("input", newValue);
    }
  }
};
</script>
