<template>
  <div ref="rootEl" v-overlay-container="{ togglePropName: 'isListVisible' }">
    <button class="trigger" :class="selectedClass" @click="onTriggerClick">
      {{ value }}
    </button>
    <transition name="fade">
      <ul class="dropdown" v-if="isListVisible">
        <li class="option" v-for="option in options" :key="option.value">
          <button :class="option.value" @click="onListItemClick(option.value)">
            {{ option.label }}
          </button>
        </li>
      </ul>
    </transition>
    <select class="native" v-model="selected" @change="onSelectChange" :class="selectedClass">
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>
<style scoped lang="scss">
@import "../../style/variables";

div {
  position: relative;
  overflow: visible;
  height: 28px;
}
.trigger {
  display: none;

  @media (min-width: $breakpoint-tablet-portrait) {
    display: initial;
  }
}
.native {
  @media (min-width: $breakpoint-tablet-portrait) {
    display: none;
  }
}
.dropdown {
  display: none;

  @media (min-width: $breakpoint-tablet-portrait) {
    list-style: none outside;
    display: block;
    position: absolute;
    top: 100%;
    left: 0;
    padding: 0;
    margin: 4px 0 0 0;
    background: white;
    border-radius: 3px;
    box-shadow: 0 2px 4px 0 $greyscale-2;

    &.fade-enter-active,
    &.fade-leave-active {
      transition: opacity 0.2s ease-in-out, margin-top 0.2s ease-in-out;
    }

    &.fade-enter,
    &.fade-leave-to {
      margin-top: 8px;
      opacity: 0;
    }
  }

  .option {
    margin: 4px 8px;

    button {
      border: 0 none;
      cursor: pointer;
      text-align: center;
      color: $greyscale-1;
    }
  }
}
</style>
<script>
import "../../directives/overlayContainer";

export default {
  props: {
    value: String,
    options: Array
  },
  data() {
    return {
      selected: this.value,
      isListVisible: false
    };
  },
  computed: {
    selectedClass: function() {
      return `selected-${this.selected}`;
    }
  },
  methods: {
    onTriggerClick() {
      this.isListVisible = !this.isListVisible;
    },

    onListItemClick(value) {
      this.selectOption(value);
    },

    onSelectChange(event) {
      this.selectOption(event.target.value);
    },

    selectOption(value) {
      this.selected = value;
      this.isListVisible = false;
      this.$emit("input", value);
    }
  }
};
</script>
