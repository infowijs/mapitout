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
        >
          <icon :name="option.icon" />
        </button>
      </li>
    </ul>
  </label>
</template>
<style scoped lang="scss">
@import "../../style/variables";

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
  padding: 0;
  border-radius: 13px;
  background-color: transparent;
  height: 28px;

  svg {
    color: $greyscale-1;
  }

  &.selected {
    svg {
      color: white;
    }
    background-color: $greyscale-1;
  }
}
</style>
<script>
import Icon from "../Icon";

const TRANSPORT_TYPES = [
  { value: "public", label: "Public Transport", icon: "bus" },
  { value: "car", label: "Vehicle", icon: "car" },
  { value: "bicycle", label: "Bicycle", icon: "bicycle" },
  { value: "foot", label: "Walking", icon: "pedestrian" },
  { value: "mixed", label: "Public Transport and Bicycle", icon: "bicycle-bus" }
];
export default {
  props: {
    value: {
      type: String,
      default: "public",
      validator: value => TRANSPORT_TYPES.map(type => type.value).indexOf(value) !== -1
    }
  },
  components: { Icon },
  data() {
    return {
      publicPath: process.env.BASE_URL,
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
