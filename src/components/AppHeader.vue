<template>
  <header>
    <router-link to="/" class="logo">
      <logo class="icon"></logo>
      <span class="text-map">map</span>
      <span class="text-it">it</span>
      <span class="text-out">out</span>
    </router-link>
    <button class="filters-toggle" @click="onClickFiltersToggle">
      <span>Living Essentials</span>
      <icon-buildings class="icon"></icon-buildings>
    </button>
    <a
      class="iamsterdam"
      href="https://www.iamsterdam.com/en/living/about-living-in-amsterdam/living-in-the-amsterdam-area"
      title="Living in the Amsterdam Area | I amsterdam"
    >
      <img
        src="../assets/iamsterdam-tablet-landscape.png"
        alt="Living in the Amsterdam Area | I amsterdam"
        srcset="
          ../assets/iamsterdam-mobile.png           105w,
          ../assets/iamsterdam-tablet-landscape.png 179w
        "
        sizes="(min-width: 769px) 179px, 105px"
      />
    </a>
  </header>
</template>
<style scoped lang="scss">
@import "../style/variables";

header {
  position: relative;
  background: $greyscale-0;
  overflow: visible;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;

  @media (min-width: $breakpoint-desktop) {
    padding: 0 15%;
  }
}

.logo {
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  text-decoration: none;
  line-height: 1;

  .icon {
    width: 32px;
    height: 32px;
    margin-right: 16px;
  }

  span {
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;

    @media (min-width: $breakpoint-tablet-portrait) {
      font-size: 14px;
    }

    &.text-it {
      color: $primary;
    }

    &.text-map,
    &.text-out {
      color: $greyscale-2;
    }
  }
}

.filters-toggle {
  display: flex;
  align-items: center;
  background-color: transparent;
  outline: none;
  border: 0 none;
  color: $greyscale-2;
  text-transform: uppercase;
  font-size: 11px;
  font-weight: 500;
  line-height: 1;
  cursor: pointer;

  .icon {
    height: 16px;
    width: 16px;
    color: $greyscale-2;
    margin-left: 16px;
  }

  @media (min-width: $breakpoint-tablet-portrait) {
    display: none;
  }
}

.iamsterdam {
  position: absolute;
  top: 100%;
  right: 10px;

  @media (min-width: $breakpoint-tablet-portrait) {
    right: 20px;
  }

  @media (min-width: $breakpoint-desktop) {
    right: 15%;
  }
}
</style>
<script>
import Logo from "@/assets/logo.svg?inline";
import IconBuildings from "@/assets/icons/IconBuildings.svg?inline";

export default {
  components: {
    Logo,
    IconBuildings
  },
  props: {
    value: Boolean
  },
  methods: {
    onClickFiltersToggle() {
      this.$emit("input", !this.value);
    }
  }
};
</script>
