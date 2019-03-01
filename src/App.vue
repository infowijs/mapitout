<template>
  <div id="app">
    <app-header />
    <main>
      <article>
        <section>
          <app-map />
        </section>
        <aside>
          <app-tabs />
        </aside>
      </article>
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

#app {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

main {
  position: relative;
  flex-grow: 1;
}

article {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
section {
  flex-grow: 1;
  position: relative;

  @media (min-width: $breakpoint-tablet) {
    flex-grow: unset;
    position: absolute;
    z-index: 1;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
}

aside {
  height: 126px;
  width: 100%;
  overflow: hidden;

  &.expanded {
    position: absolute;
    bottom: 0;
    height: 100%;
  }

  @media (min-width: $breakpoint-tablet) {
    height: auto;
    width: -moz-fit-content;
    overflow: visible;
    margin: 24px 0 24px 24px;

    &.expanded {
      position: relative;
      bottom: unset;
      height: auto;
    }
  }
}
</style>
<script>
import AppHeader from "./components/AppHeader";
import AppMap from "./components/AppMap";
import AppTabs from "./components/AppTabs";

export default {
  components: {
    AppHeader,
    AppMap,
    AppTabs
  }
};
</script>
