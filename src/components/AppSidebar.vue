<template>
  <aside class="sidebar"></aside>
</template>
<style scoped lang="scss">
@import "../style/variables";

.sidebar {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  transition: border-top-left-radius 0.2s ease-in-out, border-top-right-radius 0.2s ease-in-out,
    height 0.2s ease-in-out;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background: white;

  @media (min-width: $breakpoint-tablet-portrait) {
    overflow: visible;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    height: auto;
    background: transparent;
  }
}
</style>
