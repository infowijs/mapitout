<template>
  <div
    :class="['location-type', { disabled: isDisabled, open: isListVisible }]"
    v-overlay-container="{ togglePropName: 'isListVisible' }"
  >
    <button tabindex="0" class="trigger" @click="onTriggerClick">
      <component class="icon-type" :is="selectedTypeIcon" />
      <caret-down class="icon-dropdown" />
    </button>
    <transition name="fade">
      <ul class="dropdown" v-if="isListVisible">
        <li class="item" v-for="option in options" :key="option.id">
          <button tabindex="0" class="option" @click="onListItemClick(option.id)">
            <component class="icon" :is="option.iconComponent" />
            <span>{{ option.label }}</span>
          </button>
        </li>
      </ul>
    </transition>
    <label>
      <select
        class="native"
        tabindex="0"
        v-model="value"
        :disabled="isDisabled"
        @change="onSelectChange"
      >
        <option v-for="option in options" :key="option.id" :value="option.id">
          {{ option.label }}
        </option>
      </select>
    </label>
  </div>
</template>
<style scoped lang="scss">
@import "../../style/variables";

.location-type {
  position: relative;
  overflow: visible;
  display: flex;

  &.disabled {
    &::after {
      content: " ";
      position: absolute;
      z-index: 4;
      width: 100%;
      height: 100%;
    }
  }
}
.trigger {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px;
  border: 0 none;
  outline: 0;
  background-color: transparent;
  cursor: pointer;
  z-index: 2;
  position: relative;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: white;
  }

  &:focus {
    background-color: white;
  }

  .icon-type {
    height: 28px;
    width: 28px;
    color: $greyscale-2;
  }

  .icon-dropdown {
    height: 8px;
    width: 8px;
    margin-left: 8px;
    color: $greyscale-1;
    transition: transform 0.2s ease-in-out;

    .open & {
      transform: rotate(180deg);
    }

    .disabled & {
      visibility: hidden;
    }
  }

  .open & {
    background: white;
    box-shadow: 0 6px 4px 0 $greyscale-1;

    &::before {
      content: " ";
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      right: -4px;
      display: block;
      height: 7px;
      background-color: white;
    }

    &::after {
      content: " ";
      position: absolute;
      top: calc(100% - 1px);
      left: 0;
      right: 0;
      display: block;
      height: 6px;
      background-color: white;
    }
  }

  .disabled & {
    cursor: default;
  }
}
.dropdown {
  display: none;

  @media (min-width: $breakpoint-tablet-portrait) {
    list-style: none outside;
    position: absolute;
    top: 100%;
    left: 0;
    margin: 4px 0 0 0;
    background: white;
    border-radius: 0 3px 3px 3px;
    box-shadow: 0 2px 4px 0 $greyscale-1;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 144px;
    padding: 4px;

    &.fade-enter-active,
    &.fade-leave-active {
      transition: opacity 0.2s ease-in-out, margin-top 0.2s ease-in-out;
    }

    &.fade-enter,
    &.fade-leave-to {
      margin-top: 0;
      opacity: 0;
    }
  }
}

.item {
  margin: 4px;
}

.option {
  border: 0 none;
  outline: 0 none;
  cursor: pointer;
  color: $greyscale-1;
  width: 40px;
  padding: 4px;
  background-color: transparent;
  font-size: 11px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .icon {
    height: 24px;
    width: 24px;
    color: $greyscale-2;
    margin-bottom: 8px;
  }

  &:hover {
    background-color: $greyscale-2;
  }

  &:focus {
    background-color: $greyscale-2;
  }
}

.native {
  width: 52px;
  height: 36px;
  border: 0 none;
  appearance: none;
  font-size: 16px;
  background-color: transparent;
  cursor: pointer;
  color: transparent;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 3;

  option {
    color: black;
  }

  @media (min-width: $breakpoint-tablet-portrait) {
    display: none;
  }
}
</style>
<script>
import "../../directives/overlayContainer";

import IconHome from "@/assets/icons/IconHome.svg?inline";
import IconTransport from "@/assets/icons/IconBus.svg?inline";
import IconHealth from "@/assets/icons/IconHealth.svg?inline";
import IconWork from "@/assets/icons/IconWork.svg?inline";
import IconEducation from "@/assets/icons/IconEducation.svg?inline";
import IconWellness from "@/assets/icons/IconWellness.svg?inline";
import CaretDown from "@/assets/CaretDown.svg?inline";

export default {
  components: {
    IconHome,
    IconTransport,
    IconHealth,
    IconWork,
    IconEducation,
    IconWellness,
    CaretDown
  },
  props: {
    value: {
      type: Number,
      default: 0
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    options: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isListVisible: false
    };
  },
  computed: {
    selectedTypeIcon: function() {
      const option = this.options.find(option => option.id === this.value);

      if (option) {
        return option.iconComponent;
      }

      return null;
    }
  },
  watch: {
    selected: function(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.$emit("input", newValue);
      }
    }
  },
  methods: {
    onTriggerClick() {
      if (!this.isDisabled) {
        this.isListVisible = !this.isListVisible;
      }
    },

    onListItemClick(value) {
      this.$emit("input", value);
      this.isListVisible = false;
    },

    onSelectChange(event) {
      this.$emit("input", parseInt(event.target.value));
    }
  }
};
</script>
