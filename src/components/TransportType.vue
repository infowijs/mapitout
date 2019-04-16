<template>
  <div :class="['transport-type', { disabled: isDisabled }]">
    <ul class="list">
      <li
        v-for="option in options"
        :key="option.id"
        :class="['item', { selected: option.id === value }]"
      >
        <button
          :class="['option', { selected: option.id === value }]"
          tabindex="0"
          :title="options.label"
          @click="onListItemClick(option.id)"
        >
          <component :is="option.icon" class="icon" />
        </button>
      </li>
    </ul>
  </div>
</template>
<style scoped lang="scss">
@import "../style/variables";

.list {
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
  outline: none;

  &.selected {
    background-color: $greyscale-1;

    .disabled & {
      background-color: transparent;
      display: block;
      cursor: default;
    }
  }

  &:hover {
    &:not(.selected) {
      background-color: white;
    }
  }

  &:focus {
    &:not(.selected) {
      background-color: white;
    }
  }

  .icon {
    color: $greyscale-1;

    .selected & {
      color: white;

      .disabled & {
        color: rgba($greyscale-1, 0.4);
      }
    }
  }
}

.item {
  padding: 0 4px;

  .disabled & {
    &:not(.selected) {
      display: none;
    }
  }
}
</style>
<script>
import IconTransportBicycle from "@/assets/icons/IconTransportBicycle.svg?inline";
import IconTransportBicycleBus from "@/assets/icons/IconTransportBicycleBus.svg?inline";
import IconTransportBus from "@/assets/icons/IconTransportBus.svg?inline";
import IconTransportCar from "@/assets/icons/IconTransportCar.svg?inline";
import IconTransportPedestrian from "@/assets/icons/IconTransportPedestrian.svg?inline";

export default {
  props: {
    value: {
      type: Number,
      default: 0
    },
    options: {
      type: Array,
      required: true
    },
    isDisabled: Boolean
  },
  components: {
    IconTransportBicycle,
    IconTransportBicycleBus,
    IconTransportBus,
    IconTransportCar,
    IconTransportPedestrian
  },
  methods: {
    onListItemClick(id) {
      this.select(id);
    },

    select(id) {
      if (id !== this.value) {
        this.$emit("input", id);
      }
    }
  }
};
</script>
