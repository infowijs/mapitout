<template>
  <div class="panel panel-ranges">
    <div class="body">
      <ul class="ranges">
        <li
          v-for="range in ranges"
          :key="range.id"
          :class="['item', { active: range.id === activeRangeId }]"
        >
          <range
            :class="{ defined: !!range.originId }"
            :collapsed="range.id !== activeRangeId"
            :value="range"
            @click="onRangeClick"
            @input="onRangeChange"
            v-on:remove="onRangeRemove"
          />
        </li>
      </ul>
    </div>
    <div class="footer" v-if="ranges.length < 3">
      <button class="add" @click="onAddClick">
        New Range
      </button>
    </div>
  </div>
</template>
<style scoped lang="scss">
@import "../style/variables";

.panel-ranges {
  &.collapsed {
    @media (max-width: $breakpoint-tablet-portrait - 1) {
      .footer {
        display: none;
      }

      .body {
        height: 80px;
        overflow: hidden;
      }

      .item {
        display: none;

        &.active {
          display: block;
          overflow: hidden;

          .range::v-deep {
            .origin {
              &::after {
                content: " ";
                display: block;
                position: absolute;
                z-index: 4;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
              }
            }

            &.defined {
              .travel-time {
                background-color: $greyscale-2;
                order: 1;
              }
            }
          }
        }
      }
    }
  }
}

.ranges {
  margin: 0;
  padding: 0;
  list-style: none inside;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.item {
  &:hover {
    background-color: $greyscale-2;
    cursor: pointer;
  }

  .range {
    margin: 0 16px;
    border-bottom: 2px solid $greyscale-2;
  }

  &.active {
    &:hover {
      background-color: transparent;
      cursor: default;
    }

    .range {
      margin: 0;
      border-bottom: 0 none;
    }
  }
}

.add {
  display: block;
  border: 1px solid lighten($greyscale-1, 25);
  background-color: white;
  padding: 8px 16px;
  cursor: pointer;
  color: lighten($greyscale-1, 25);

  &:hover {
    color: $greyscale-1;
    border-color: $greyscale-1;
  }
}
</style>
<script>
import qs from "qs";
import { mapActions, mapState } from "vuex";

import Range from "./range/Range";

export default {
  components: {
    Range
  },

  computed: {
    ...mapState("ranges", {
      ranges: state => state.ranges,
      activeRangeId: state => state.activeId
    })
  },

  async beforeRouteUpdate(to, from, next) {
    await this.init();

    next();
  },

  async created() {
    await this.init();
  },

  methods: {
    ...mapActions("ranges", {
      addRange: "add",
      activateRange: "activate",
      replaceRanges: "replace"
    }),

    async init() {
      let rangeId;

      if (this.ranges.length === 0) {
        await this.addRange(Range.props.value.default());
      }

      rangeId = this.ranges[this.ranges.length - 1].id;

      if (this.activeRangeId !== rangeId) {
        this.activateRange(rangeId);
      }
    },

    onRangeRemove(event, rangeId) {
      const ranges = this.ranges.map(range => (range.id === rangeId ? undefined : range));

      this.navigate(ranges.filter(range => range));
    },

    onRangeClick(event, rangeId) {
      if (this.activeRangeId !== rangeId) {
        this.activateRange(rangeId);
      }
    },

    onRangeChange(updatedRange) {
      const ranges = this.ranges.map(range =>
        range.id === updatedRange.id ? updatedRange : range
      );

      this.navigate(ranges);
    },

    async onAddClick() {
      await this.addRange(Range.props.value.default());

      this.activateRange(this.ranges[this.ranges.length - 1].id);
    },

    navigate(ranges) {
      const rangesWithOrigin = ranges.filter(range => range.originId);

      if (!this.$route.query.r && rangesWithOrigin.length === 0) {
        this.replaceRanges(ranges);
      } else {
        const rQueryString =
          rangesWithOrigin.length > 0
            ? qs.stringify(
                rangesWithOrigin.map(definedRange => ({
                  id: definedRange.id,
                  otId: definedRange.originTypeId,
                  oId: definedRange.originId,
                  o: definedRange.origin,
                  ttId: definedRange.transportTypeId,
                  tt: definedRange.travelTime,
                  t: new Date(definedRange.departureTime).getTime()
                }))
              )
            : undefined;

        if (this.$route.query.r !== rQueryString) {
          this.$router.push({ query: { ...this.$route.query, r: rQueryString } });
        }
      }
    }
  }
};
</script>
