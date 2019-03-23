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
          <icon :name="option.icon" />
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
    },
    isDisabled: Boolean
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
