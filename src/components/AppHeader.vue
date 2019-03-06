<template>
  <header>
    <router-link to="/" class="logo">map<span>it</span>out</router-link>
    <a
      class="iamsterdam"
      href="https://www.iamsterdam.com/en/living/about-living-in-amsterdam/living-in-the-amsterdam-area"
      alt="Living in the Amsterdam Area | I amsterdam"
    >
      <img
        src="../assets/iamsterdam-tablet-landscape.png"
        alt="IAmsterdam"
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
  height: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
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
  height: 40px;
  padding-left: 60px;
  background: url("../assets/logo.svg") no-repeat;
  background-size: 40px 40px;
  text-transform: uppercase;
  color: #f7f7f7;
  text-decoration: none;
  font-size: 13px;
  letter-spacing: 2px;
  line-height: 18px;

  span {
    color: $primary;
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
