<template>
  <div :class="['transport-type', { disabled: isDisabled }]">
    <ul class="list">
      <li
        v-for="(option, index) in options"
        :key="option.value"
        class="option"
        :class="[option.value, { selected: option.value === value }]"
      >
        <button tabindex="0" :title="options.label" @click="onListItemClick(index)">
          <component :is="option.icon" />
        </button>
      </li>
    </ul>
  </div>
</template>
<style scoped lang="scss">
@import "../../style/variables";

.option {
  margin: 0 0.5rem;

  &:first-child {
    margin-left: 0;
  }

  &:last-child {
    margin-right: 0;
  }

  button {
    border: 0 none;
    cursor: pointer;
    padding: 0;
    border-radius: 13px;
    background-color: transparent;
    height: 28px;
    outline: none;

    svg {
      color: $greyscale-1;
    }
  }

  &.selected {
    button {
      background-color: $greyscale-1;

      svg {
        color: white;
      }
    }
  }
}

.disabled {
  .option {
    display: none;
    margin: 0;

    &.selected {
      display: block;

      button {
        background-color: transparent;
        display: block;
        cursor: default;

        svg {
          color: rgba($greyscale-1, 0.4);
        }
      }
    }
  }
}

.list {
  list-style: none;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 0;
  padding: 0;
  line-height: 1;
}
</style>
<script>
import IconBicycle from "../../assets/icons/IconBicycle.svg";
import IconBicycleBus from "../../assets/icons/IconBicycleBus.svg";
import IconBus from "../../assets/icons/IconBus.svg";
import IconCar from "../../assets/icons/IconCar.svg";
import IconPedestrian from "../../assets/icons/IconPedestrian.svg";

const TRANSPORT_TYPES = [
  { value: "public", label: "Public Transport", icon: "icon-bus" },
  { value: "car", label: "Vehicle", icon: "icon-car" },
  { value: "bicycle", label: "Bicycle", icon: "icon-bicycle" },
  { value: "foot", label: "Walking", icon: "icon-pedestrian" },
  { value: "mixed", label: "Public Transport and Bicycle", icon: "icon-bicycle-bus" }
];
export default {
  props: {
    value: {
      type: String,
      default: "public",
      validator: value => TRANSPORT_TYPES.map(type => type.value).indexOf(value) !== -1
    },
    isDisabled: Boolean
  },
  components: {
    IconBicycle,
    IconBicycleBus,
    IconBus,
    IconCar,
    IconPedestrian
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
