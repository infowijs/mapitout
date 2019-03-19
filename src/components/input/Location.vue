<template>
  <div>
    <location-type class="type" v-model="value.type" @input="onInput"></location-type>
    <location-address class="address" v-model="value.address" @input="onInput"></location-address>
  </div>
</template>
<style scoped lang="scss">
div {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.address {
  flex-grow: 1;
  margin-left: 12px;
}
</style>
<script>
import LocationType from "./LocationType";
import LocationAddress from "./LocationAddress";

export default {
  props: {
    value: {
      type: Object,
      default: function() {
        return {
          type: "home",
          address: {
            address: ""
          }
        };
      }
    }
  },
  components: {
    LocationType,
    LocationAddress
  },
  methods: {
    onInput() {
      if (this.validate()) {
        this.$emit("input", this.value);
      }
    },

    validate() {
      let valid = false;

      const address = this.value.address.address;
      const coords = this.value.address.coordinates;

      if (address.length > 0 && coords) {
        valid = true;
      } else if (!coords) {
        valid = true;
      }

      return valid;
    }
  }
};
</script>
