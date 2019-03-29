<template>
  <div :class="['location', { disabled: isDisabled }]">
    <enhanced-select
      class="type"
      v-model="type"
      :isDisabled="isDisabled"
      :options="locationTypes"
    />
    <suggest-input
      class="address"
      v-model="address"
      :isDisabled="isDisabled"
      :search="search"
      :resolve="resolve"
      placeholder="Choose an address"
    />
  </div>
</template>
<style scoped lang="scss">
@import "../../style/variables";

$locationTypeIconPaths: (
  (home, "../../assets/icons/IconHome.svg?external"),
  (work, "../../assets/icons/IconWork.svg?external"),
  (health, "../../assets/icons/IconHealth.svg?external"),
  (wellness, "../../assets/icons/IconWellness.svg?external"),
  (transport, "../../assets/icons/IconTransport.svg?external"),
  (education, "../../assets/icons/IconEducation.svg?external")
);

.location {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.type::v-deep {
  display: flex;

  .trigger {
    height: 28px;
    border: 0 none;
    background-color: transparent;
    background-repeat: no-repeat;
    background-position: left center;
    padding: 0 0 0 36px;
    font-size: 0;

    &::after {
      content: " ";
      display: block;
      height: 100%;
      width: 8px;
      background: transparent url("../../assets/carret-down.svg?external") no-repeat center center;
    }

    @each $key, $path in $locationTypeIconPaths {
      &.selected-#{$key} {
        background-image: url($path);
      }
    }
  }

  .dropdown {
    @media (min-width: $breakpoint-tablet-portrait) {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      width: 162px;
      padding: 9px 12px;
    }

    .option {
      margin: 5px 11px;

      button {
        width: 30px;
        padding: 30px 0 0 0;
        background-size: 26px 26px;
        background-position: center 2px;
        background-repeat: no-repeat;
        background-color: transparent;
        font-size: 11px;

        @each $key, $path in $locationTypeIconPaths {
          &.#{$key} {
            background-image: url($path);
          }
        }
      }
    }
  }

  .native {
    width: 40px;
    height: 28px;
    border: 0 none;
    appearance: none;
    font-size: 16px;
    background-color: transparent;
    background-repeat: no-repeat, no-repeat;
    background-position: center right, left center;
    cursor: pointer;
    color: transparent;

    option {
      color: black;
    }

    @each $key, $path in $locationTypeIconPaths {
      &.selected-#{$key} {
        background-image: url("../../assets/carret-down.svg?external"), url($path);
      }
    }
  }

  .disabled & {
    &::after {
      content: " ";
      position: absolute;
      z-index: 1;
      width: 100%;
      height: 100%;
    }
    .trigger {
      padding: 0 0 0 44px;

      &::after {
        display: none;
      }
    }

    .native {
      z-index: -1;
      background-position: -100% -100%, left center;
    }
  }
}

.address::v-deep {
  flex-grow: 1;
  margin-left: 1rem;

  &::after {
    content: " ";
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    width: 25%;
    height: calc(100% - 2px);
    background: linear-gradient(to right, rgba(255, 255, 255, 0), $greyscale-2);
  }

  &.focused::after {
    content: none;
  }

  .input {
    border-width: 0 0 2px 0;
  }

  .disabled & {
    &::after {
      width: 40%;
      background: linear-gradient(to right, rgba(255, 255, 255, 0), white);
    }

    .input {
      border-width: 0;
      padding: 0;
    }
  }
}
</style>
<script>
import EnhancedSelect from "./EnhancedSelect";
import SuggestInput from "./SuggestInput";
import { mapActions, mapState } from "vuex";

export default {
  props: {
    value: {
      type: Object,
      default: function() {
        return {
          type: "home",
          addressId: undefined,
          address: undefined,
          coordinates: null
        };
      }
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  components: {
    EnhancedSelect,
    SuggestInput
  },
  data() {
    return {
      type: this.value.type,
      address: {
        id: this.value.addressId,
        value: this.value.coordinates,
        label: this.value.address
      }
    };
  },
  computed: {
    ...mapState("address", {
      locationTypes: state => state.types
    })
  },
  watch: {
    type: function(type) {
      this.$emit("input", { ...this.value, type });
    },

    address: function(address) {
      this.$emit("input", {
        ...this.value,
        addressId: address.id,
        address: address.label,
        coordinates: address.value
      });
    }
  },
  methods: {
    ...mapActions("address", ["search", "resolve"])
  }
};
</script>
