<template>
  <aside></aside>
</template>
<style scoped lang="scss">
@import "../style/variables";

aside {
  background: white;
  height: 100px;

  @media (min-width: $breakpoint-tablet-portrait) {
    min-width: 340px;
    height: unset;
  }
}
</style>
