<template>
  <div class="location">
    <enhanced-select class="type" v-model="type" :options="locationTypes"></enhanced-select>
    <suggest-input
      class="address"
      v-model="address"
      :search="search"
      :resolve="resolve"
      placeholder="Choose an address"
    ></suggest-input>
  </div>
</template>
<style scoped lang="scss">
@import "../../style/variables";

$locationTypeIconPaths: (
  (home, "../../assets/icons/symbol-house.svg"),
  (work, "../../assets/icons/symbol-work.svg"),
  (health, "../../assets/icons/symbol-health.svg"),
  (wellness, "../../assets/icons/symbol-wellness.svg"),
  (transport, "../../assets/icons/symbol-transport.svg"),
  (education, "../../assets/icons/symbol-education.svg")
);

.location {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.type::v-deep {
  display: flex;

  .trigger {
    width: 28px;
    height: 28px;
    border: 0 none;
    background-color: transparent;
    background-repeat: no-repeat;
    background-position: left center;
    padding-left: 32px;
    cursor: pointer;
    font-size: 0;

    &::after {
      content: " ";
      display: block;
      height: 100%;
      width: 8px;
      background: transparent url("../../assets/carret-down.svg") no-repeat center center;
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
    background-position: center right, left, center;
    cursor: pointer;
    color: transparent;

    option {
      color: black;
    }

    @each $key, $path in $locationTypeIconPaths {
      &.selected-#{$key} {
        background-image: url("../../assets/carret-down.svg"), url($path);
      }
    }
  }
}

.address {
  flex-grow: 1;
  margin-left: 12px;

  &::after {
    content: " ";
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    width: 25%;
    height: calc(100% - 2px);
    background: linear-gradient(to right, rgba(255, 255, 255, 0), white);
  }

  &.focused::after {
    content: none;
  }

  &::v-deep {
    .input {
      border-width: 0 0 2px 0;
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
    value: Object
  },
  components: {
    EnhancedSelect,
    SuggestInput
  },
  data() {
    return {
      type: this.value ? this.value.type : "home",
      address: this.value ? this.value.address : null
    };
  },
  computed: {
    ...mapState("address", {
      locationTypes: state => state.types
    })
  },
  watch: {
    type: function(type) {
      const currentValue = this.value ? this.value : {};
      this.setValue({ ...currentValue, type });
    },
    address: function(address) {
      const currentValue = this.value ? this.value : {};
      this.setValue({ ...currentValue, address });
    }
  },
  methods: {
    ...mapActions("address", ["search", "resolve"]),

    setValue(newValue) {
      this.$emit("input", newValue);
    }
  }
};
</script>
