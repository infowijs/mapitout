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
          <component :is="option.component" />
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
import IconBus from "../icons/IconBus";
import IconCar from "../icons/IconCar";
import IconPedestrian from "../icons/IconPedestrian";
import IconBicycle from "../icons/IconBicycle";
import IconBicycleBus from "../icons/IconBicycleBus";

const TRANSPORT_TYPES = [
  { value: "public", label: "Public Transport", component: IconBus },
  { value: "car", label: "Vehicle", component: IconCar },
  { value: "bicycle", label: "Bicycle", component: IconBicycle },
  { value: "foot", label: "Walking", component: IconPedestrian },
  { value: "mixed", label: "Public Transport and Bicycle", component: IconBicycleBus }
];
export default {
  props: {
    value: {
      type: String,
      default: "public",
      validator: value => TRANSPORT_TYPES.map(type => type.value).indexOf(value) !== -1
    }
  },
  components: {
    IconBus,
    IconCar,
    IconPedestrian,
    IconBicycle,
    IconBicycleBus
  },
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
