<template>
  <aside class="sidebar">
    <nav class="tabs">
      <ul>
        <li>
          <router-link :to="{ name: 'ranges' }" exact>
            <icon-area class="icon"></icon-area>
            <span>Range</span>
          </router-link>
        </li>
      </ul>
    </nav>
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

.tabs {
  background-color: $greyscale-0;

  ul {
    list-style: none;
    margin: 0;
    padding: 0 32px;
    height: 50px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;

    li {
      flex-basis: 50%;
      margin: 0 12px;
      height: 36px;

      &:first-child {
        margin-left: 0;
      }

      &:last-child {
        margin-right: 0;
      }

      a {
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
import IconArea from "@/assets/icons/IconArea.svg?inline";

export default {
  components: {
    IconArea
  }
};
</script>
