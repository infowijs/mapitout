<template>
  <nav class="nav">
    <ul class="tabs">
      <li class="tab">
        <router-link :to="{ path: '/ranges' }" class="link">
          <icon-area class="icon"></icon-area>
          <span>Range</span>
        </router-link>
      </li>
    </ul>
  </nav>
</template>
<style scoped lang="scss">
@import "../style/variables";

.nav {
  background-color: $greyscale-0;

  .tabs {
    list-style: none;
    margin: 0;
    padding: 0 32px;
    height: 50px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;

    .tab {
      flex-basis: 50%;
      margin: 0 12px;
      height: 36px;

      &:first-child {
        margin-left: 0;
      }

      &:last-child {
        margin-right: 0;
      }

      .link {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        text-decoration: none;
        background-color: transparent;
        cursor: pointer;

        .icon {
          color: white;
          width: 16px;
          height: 16px;

          :hover & {
            color: $greyscale-2;
          }
        }

        span {
          color: white;
          text-transform: uppercase;
          font-weight: 500;
          font-size: 12px;
          margin-left: 12px;

          :hover & {
            color: $greyscale-2;
          }
        }

        &.router-link-active {
          background-color: $greyscale-2;
          cursor: default;

          .icon,
          span {
            color: $greyscale-0;

            :hover & {
              color: $greyscale-0;
            }
          }
        }
      }
    }
  }
}
</style>
<script>
import IconArea from "@/assets/icons/IconArea.svg?inline";

export default {
  components: {
    IconArea
  }
};
</script>
