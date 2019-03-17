<template>
  <div ref="rootEl">
    <button class="trigger" :class="selectedClass" @click="onTriggerClick" />
    <transition name="fade">
      <ul v-if="isListVisible">
        <li v-for="option in options" v-bind:key="option.value">
          <button class="option" :class="option.value" @click="onListItemClick(option.value)">
            {{ option.label }}
          </button>
        </li>
      </ul>
    </transition>
    <select v-bind:value="value" @change="onSelectChange" :class="selectedClass">
      <option v-for="option in options" v-bind:key="option.value" v-bind:value="option.value">
        {{ option.label }}
      </option>
    </select>
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

div {
  position: relative;
  overflow: visible;
  height: 28px;
}

.trigger {
  display: none;

  @media (min-width: $breakpoint-tablet-portrait) {
    width: 28px;
    height: 28px;
    border: 0 none;
    background-color: transparent;
    background-repeat: no-repeat;
    background-position: left center;
    padding-left: 32px;
    cursor: pointer;
    display: initial;
  }

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

ul {
  display: none;

  @media (min-width: $breakpoint-tablet-portrait) {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    position: absolute;
    top: 100%;
    left: 0;
    margin: 16px 0 0 0;
    background: white;
    list-style: none outside;
    width: 162px;
    padding: 9px 12px;
    border-radius: 3px;
    box-shadow: 0 2px 4px 0 $greyscale-2;

    &.fade-enter-active,
    &.fade-leave-active {
      transition: opacity 0.2s ease-in-out, margin-top 0.2s ease-in-out;
    }

    &.fade-enter,
    &.fade-leave-to {
      margin-top: 12px;
      opacity: 0;
    }
  }

  li {
    margin: 5px 11px;

    .option {
      width: 30px;
      padding: 30px 0 0 0;
      background-size: 26px 26px;
      background-position: center 2px;
      background-repeat: no-repeat;
      background-color: transparent;
      border: 0 none;
      cursor: pointer;
      font-size: 11px;
      text-align: center;
      color: $greyscale-1;

      @each $key, $path in $locationTypeIconPaths {
        &.#{$key} {
          background-image: url($path);
        }
      }
    }
  }
}

select {
  width: 40px;
  height: 28px;
  border: 0 none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  font-size: 16px;
  background-repeat: no-repeat, no-repeat;
  background-position: center right, left, center;
  cursor: pointer;
  color: transparent;

  @media (min-width: $breakpoint-tablet-portrait) {
    display: none;
  }

  @each $key, $path in $locationTypeIconPaths {
    &.selected-#{$key} {
      background-image: url("../../assets/carret-down.svg"), url($path);
    }
  }
}
</style>
<script>
const LOCATION_TYPES = [
  { value: "home", label: "Home" },
  { value: "transport", label: "Station" },
  { value: "health", label: "Health" },
  { value: "work", label: "Work" },
  { value: "education", label: "School" },
  { value: "wellness", label: "Gym" }
];

export default {
  props: {
    value: {
      type: String,
      default: "home",
      validator: value => LOCATION_TYPES.map(type => type.value).indexOf(value) !== -1
    }
  },
  data() {
    return {
      options: LOCATION_TYPES,
      selected: "home",
      selectedClass: "selected-home",
      isListVisible: false
    };
  },
  mounted() {
    document.addEventListener("click", this.onDocumentClick);
  },
  destroyed() {
    document.removeEventListener("click", this.onDocumentClick);
  },
  methods: {
    onDocumentClick(event) {
      if (this.isListVisible && !this.$refs.rootEl.contains(event.target)) {
        this.isListVisible = false;
      }
    },

    onTriggerClick() {
      this.isListVisible = !this.isListVisible;
    },

    onListItemClick(value) {
      this.selectItem(value);

      this.isListVisible = false;
    },

    onSelectChange(event) {
      this.selectItem(event.target.value);
    },

    selectItem(value) {
      this.selectedClass = `selected-${this.options.find(option => option.value === value).value}`;

      this.$emit("input", value);
    }
  }
};
</script>
