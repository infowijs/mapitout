<template>
  <aside v-expandable>
    <range-input :isActive="activeRange === 0" v-model="range1" @focus="focusRangeInput(0)" />
    <range-input :isActive="activeRange === 1" v-model="range2" @focus="focusRangeInput(1)" />
  </aside>
</template>
<style scoped lang="scss">
@import "../style/variables";

aside {
  background: white;
  height: 86px;
  transition: height 0.2s ease-in-out;

  @media (min-width: $breakpoint-tablet-portrait) {
    width: 340px;
    height: unset;
  }

  &.expanding {
    transition: unset;
  }

  &.expanded {
    height: 100%;

    @media (min-width: $breakpoint-tablet-portrait) {
      height: unset;
    }
  }
}

.handle-drag {
  position: relative;
  background: $greyscale-0;
  height: 10px;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  cursor: pointer;
  transition: border-top-left-radius 0.2s ease-in-out, border-top-right-radius 0.2s ease-in-out;

  &::before,
  &::after {
    position: absolute;
    content: " ";
    width: 100%;
    height: 10px;
    bottom: 100%;
  }

  &::after {
    bottom: unset;
    top: 100%;
  }

  .expanding &,
  .expanded & {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  @media (min-width: $breakpoint-tablet-portrait) {
    display: none;
  }
}
</style>
<script>
import "../directives/expandable";
import RangeInput from "./input/RangeInput";

export default {
  data() {
    return {
      range1: null,
      activeRange: 0,
      range2: null
    };
  },
  components: {
    RangeInput
  },
  watch: {
    range: value => {
      console.log(value);
    }
  },
  methods: {
    focusRangeInput(index) {
      this.activeRange = index;
    }
  }
};
</script>
