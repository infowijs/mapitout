<template>
  <aside v-expandable>

  </aside>
</template>
<style scoped lang="scss">
@import "../style/variables";

aside {
  background: white;
  height: 100px;

  @media (min-width: $breakpoint-tablet-portrait) {
    min-width: 340px;
    height: unset;

    &.expanded {
      height: unset;
    }
  }

  .handle-drag {
    background: $greyscale-0;
    height: 10px;
    border-radius: 3px 3px 0 0;
    cursor: pointer;

    @media (min-width: $breakpoint-tablet-portrait) {
      display: none;
    }
  }
  &.expanded {
    height: 100%;
  }
}
</style>
<script>
import "../directives/expandable";

export default {};
</script>
