<template>
  <div id="app">
    <app-header class="app-header" v-model="showFilters" />
    <main>
      <app-map class="app-map" />
      <aside class="sidebar" :class="{ 'expanded-filters': showFilters }" v-expandable>
        <app-navigation />
        <router-view class="main" />
        <filters-panel v-model="showFilters" />
      </aside>
    </main>
  </div>
</template>
<style>
@import "~normalize.css";
</style>
<style lang="scss">
@import "style/typography.scss";
@import "style/panel.scss";
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
  z-index: 2;
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

.sidebar {
  position: absolute;
  z-index: 3;
  bottom: 0;
  left: 0;
  right: 0;
  height: 128px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  transition: border-top-left-radius 0.2s ease-in-out, border-top-right-radius 0.2s ease-in-out,
    height 0.2s ease-in-out;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;

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
    overflow: visible;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
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

  .panel-filters {
    display: none;

    @media (min-width: $breakpoint-tablet-portrait) {
      display: block;
      margin-top: 12px;
    }
  }

  &.expanding {
    transition: unset;
    height: auto;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    background-color: white;
  }

  &.expanded,
  &.expanded-filters {
    height: 100%;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    background-color: white;

    @media (min-width: $breakpoint-tablet-portrait) {
      height: unset;
      background-color: transparent;
    }
  }

  &.expanded-filters {
    .handle-drag {
      display: none;
    }
  }

  @media (max-width: $breakpoint-tablet-portrait - 1) {
    &.expanded {
      .ranges {
        .panel-ranges {
          display: block;
          flex-grow: 1;
        }

        .panel-filters {
          display: none;
        }
      }
    }

    &.expanded-filters {
      .nav {
        display: none;
      }
      .panel-ranges {
        display: none;
      }
      .panel-filters {
        display: block;
        flex-grow: 1;
        margin-top: 0;
      }
    }
  }
}
</style>
<script>
import "./directives/expandable";
import AppHeader from "./components/AppHeader";
import AppMap from "./components/AppMap";
import AppNavigation from "./components/AppNavigation";
import FiltersPanel from "./components/FiltersPanel";

export default {
  components: {
    AppHeader,
    AppMap,
    AppNavigation,
    FiltersPanel
  },
  data() {
    return {
      showFilters: false
    };
  }
};
</script>
