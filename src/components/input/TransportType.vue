<template>
  <label>
    <ul>
      <li v-for="(option, index) in options" :key="option.value">
        <button
          tabindex="0"
          class="option"
          :class="[option.value, { selected: option.value === value }]"
          :title="options.label"
          @click="onListItemClick(index)"
        ></button>
      </li>
    </ul>
  </label>
</template>
<style scoped lang="scss">
@import "../../style/variables";

$transportTypeIconPaths: (
  (
    public,
    "../../assets/icons/symbol-public-transport.svg",
    "../../assets/icons/symbol-public-transport-active.svg"
  ),
  (car, "../../assets/icons/symbol-driving.svg", "../../assets/icons/symbol-driving-active.svg"),
  (
    bicycle,
    "../../assets/icons/symbol-cycling.svg",
    "../../assets/icons/symbol-cycling-active.svg"
  ),
  (foot, "../../assets/icons/symbol-walking.svg", "../../assets/icons/symbol-walking-active.svg"),
  (
    "mixed",
    "../../assets/icons/symbol-mixed-transportation.svg",
    "../../assets/icons/symbol-mixed-transportation-active.svg"
  )
);

ul {
  list-style: none;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 0;
  padding: 0;
  line-height: 1;
}

.option {
  border: 0 none;
  cursor: pointer;
  width: 26px;
  height: 26px;
  padding: 0;
  background-color: transparent;
  background-repeat: no-repeat;
  background-position: center center;
}

@each $key, $pathNormal, $pathActive in $transportTypeIconPaths {
  .#{$key} {
    background-image: url($pathNormal);

    &.selected {
      background-image: url($pathActive);
    }
  }
}

.mixed {
  width: 56px;
}
</style>
<script>
const TRANSPORT_TYPES = [
  { value: "public", label: "Public Transport" },
  { value: "car", label: "Vehicle" },
  { value: "bicycle", label: "Bicycle" },
  { value: "foot", label: "Walking" },
  { value: "mixed", label: "Public Transport and Bicycle" }
];
export default {
  props: {
    value: {
      type: String,
      default: "public",
      validator: value => TRANSPORT_TYPES.map(type => type.value).indexOf(value) !== -1
    }
  },
  data() {
    return {
      options: TRANSPORT_TYPES
    };
  },
  methods: {
    onListItemClick(index) {
      this.select(index);
    },

    select(index) {
      const option = this.options[index];

      this.$emit("input", option.value);
    }
  }
};
</script>
