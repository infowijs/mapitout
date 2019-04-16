<template>
  <div :class="['location', { disabled: isDisabled }]">
    <location-type
      class="type"
      v-model="value.typeId"
      :isDisabled="isDisabled"
      :options="types"
      @input="onTypeInput"
    />
    <location-address
      class="address"
      v-model="address"
      :isDisabled="isDisabled"
      :search="lookupAddress"
      placeholder="Choose an address"
      @input="onAddressInput"
    />
  </div>
</template>
<style scoped lang="scss">
@import "../style/variables";

.location {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.address {
  flex-grow: 1;
  margin-left: 16px;
}
</style>
<script>
import LocationType from "./location/LocationType";
import LocationAddress from "./location/LocationAddress";

export default {
  components: {
    LocationType,
    LocationAddress
  },
  props: {
    value: {
      type: Object,
      default: function() {
        return {
          typeId: 0,
          addressId: undefined,
          address: undefined
        };
      }
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    types: {
      type: Array,
      required: true
    },
    lookupAddress: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      address: {
        id: this.value.addressId,
        address: this.value.address
      }
    };
  },
  watch: {
    value: function(value) {
      this.address = {
        id: value.addressId,
        address: value.address
      };
    }
  },
  methods: {
    onTypeInput(typeId) {
      this.$emit("input", { ...this.value, typeId });
    },

    onAddressInput(address) {
      this.$emit("input", {
        ...this.value,
        addressId: address.id,
        address: address.address
      });
    }
  }
};
</script>
