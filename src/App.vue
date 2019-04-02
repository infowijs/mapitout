<template>
  <div id="app">
    <app-header class="app-header" />
    <main>
      <app-map class="app-map" />
      <app-sidebar class="app-sidebar" v-expandable />
    </main>
  </div>
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

#app {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: stretch;
}

main {
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  position: relative;
  padding-top: 50px;
}

.app-header {
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  right: 0;
  height: 50px;
  align-self: stretch;
}

.app-map {
  position: absolute;
  z-index: 1;
  top: 50px;
  left: 0;
  right: 0;
  bottom: 120px;

  @media (min-width: $breakpoint-tablet-portrait) {
    bottom: 0;
  }
}

.app-sidebar {
  position: absolute;
  z-index: 3;
  bottom: 0;
  left: 0;
  right: 0;
  height: 128px;

  @media (min-width: $breakpoint-tablet-portrait) {
    align-self: stretch;
    position: relative;
    width: 340px;
    left: auto;
    right: auto;
    bottom: auto;
    margin: 24px 0 24px 24px;
    max-height: 100%;
    height: auto;
  }

  .handle-drag {
    position: relative;
    height: 12px;
    padding: 12px 0;
    margin: -12px 0;
    cursor: pointer;

    @media (min-width: $breakpoint-tablet-portrait) {
      display: none;
    }

    &::before {
      content: " ";
      position: absolute;
      z-index: 1;
      top: 12px;
      left: 0;
      display: block;
      height: 12px;
      width: 100%;
      background: $greyscale-0;
    }

    &::after {
      content: " ";
      position: relative;
      z-index: 2;
      margin: 4px auto auto auto;
      display: block;
      width: 24px;
      height: 4px;
      border-radius: 2px;
      background-color: $greyscale-1;
    }
  }

  &.expanding {
    transition: unset;
    height: auto;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  &.expanded {
    height: 100%;
    border-top-left-radius: 0;
    border-top-right-radius: 0;

    @media (min-width: $breakpoint-tablet-portrait) {
      height: unset;
    }
  }
}
</style>
<script>
import "./directives/expandable";
import AppHeader from "./components/AppHeader";
import AppMap from "./components/AppMap";
import AppSidebar from "./components/AppSidebar";
import { mapActions, mapGetters } from "vuex";
import { isEqual, omit } from "lodash";

export default {
  components: {
    AppHeader,
    AppMap,
    AppSidebar
  },
  watch: {
    rangesWithOrigin: function(newValue, oldValue) {
      if (
        !isEqual(
          newValue.map(range => ({ ...omit(range, ["originType", "highlightColor"]) })),
          oldValue.map(range => ({ ...omit(range, ["originType", "highlightColor"]) }))
        )
      ) {
        this.fetchAreas(newValue);
      }
    }
  },
  computed: {
    ...mapGetters("ranges", ["rangesWithOrigin"])
  },
  methods: {
    ...mapActions({
      fetchAreas: "areas/fetch"
    })
  }
};
</script>
