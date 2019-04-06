<template>
  <aside class="sidebar">
    <app-navigation />
    <div class="panels">
      <router-view />
    </div>
  </aside>
</template>
<style scoped lang="scss">
@import "../style/variables";

.sidebar {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  transition: border-top-left-radius 0.2s ease-in-out, border-top-right-radius 0.2s ease-in-out,
    height 0.2s ease-in-out;
  overflow: hidden;

  @media (min-width: $breakpoint-tablet-portrait) {
    width: 340px;
    overflow: visible;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    height: auto;
    background: transparent;
  }
}

.panels {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
  max-height: calc(100% - 50px);
  flex-grow: 1;

  @media (min-width: $breakpoint-tablet-portrait) {
    flex-grow: initial;
  }
}

.ranges::v-deep {
  flex-grow: 1;
  overflow: hidden !important;

  @media (min-width: $breakpoint-tablet-portrait) {
    box-shadow: 0 2px 8px 0 lighten($greyscale-1, 50);
    overflow: scroll;
  }
  ul {
    .active {
      .range {
        .travel-time {
          order: 1;

          @media (min-width: $breakpoint-tablet-portrait) {
            order: 4;
          }
          .expanded &,
          .expanding & {
            order: 4;
          }
        }
      }
    }
  }
}
</style>
<script>
import AppNavigation from "./AppNavigation";

export default {
  components: {
    AppNavigation
  }
};
</script>
