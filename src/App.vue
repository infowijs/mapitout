<template>
  <main id="app">
    <app-header class="app-header" />
    <app-map class="app-map" />
    <app-sidebar class="app-sidebar" />
  </main>
</template>
<style>
@import "~normalize.css";
</style>
<style lang="scss">
@import "style/typography.scss";
</style>
<style scoped lang="scss">
@import "style/variables";
@import "style/fonts";

main {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.app-header {
  position: relative;
  z-index: 2;
}

.app-map {
  @media (min-width: $breakpoint-tablet-portrait) {
    position: relative;
    z-index: 1;
    flex-grow: 1;
  }
}

.app-sidebar {
  position: absolute;
  z-index: 3;
  bottom: 0;
  left: 0;
  right: 0;

  @media (min-width: $breakpoint-tablet-portrait) {
    top: 50px;
    left: unset;
    right: unset;
    bottom: unset;
    margin: 24px 0 24px 24px;
  }
}
</style>
<script>
import AppHeader from "./components/AppHeader";
import AppMap from "./components/AppMap";
import AppSidebar from "./components/AppSidebar";

export default {
  components: {
    AppHeader,
    AppMap,
    AppSidebar
  }
};
</script>
