<template>
  <div class="range-list">
    <ul class="list">
      <li
        class="item"
        v-for="range in ranges"
        :key="range.id"
        :class="{ active: range.id === activeRangeId }"
        @click="onRangeClick(range.id)"
      >
        <range :isDisabled="range.id !== activeRangeId" :range="range" @change="onChangeRange" />
        <button
          class="delete"
          v-if="range.id !== activeRangeId"
          @click="onClickRangeDelete(range.id, $event)"
        >
          <icon-delete class="icon" />
        </button>
      </li>
    </ul>
    <button class="add" @click="onClickAddRange" v-if="ranges.length < 3">
      New Range
    </button>
  </div>
</template>
<style scoped lang="scss">
@import "../../style/variables";

.range-list {
  overflow: scroll;

  .list {
    margin: 0;
    padding: 0;
    list-style: none;
    background-color: rgba($greyscale-1, 0.4);
    display: flex;
    flex-direction: column;
    align-items: stretch;

    .item {
      margin: 2px 0;
      height: 76px;
      display: flex;
      flex-direction: row;
      align-items: center;
      background-color: white;

      &:first-child {
        margin-top: 0;
      }

      &:last-child {
        margin-bottom: 0;
      }

      .range {
        flex-grow: 1;
      }

      .delete {
        align-self: center;
        border: 0 none;
        background: transparent;
        outline: none;
        cursor: pointer;
        margin: 0 12px;
        padding: 0;
        .icon {
          display: block;
          width: 16px;
          height: 16px;
          color: lighten($greyscale-1, 25);
        }

        &:hover {
          .icon {
            color: $greyscale-1;
          }
        }
      }

      &.active {
        height: auto;
        display: flex;
        flex-direction: row;
        align-items: stretch;
        background: white;
      }

      &:not(.active) {
        .range {
          flex-grow: 1;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          padding: 24px 0 24px 48px;
          background-color: white;
          cursor: pointer;
          overflow: hidden;
        }
      }
    }
  }

  .add {
    display: block;
    margin: 72px auto 24px auto;
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
}
</style>
<script>
import Range from "./Range";
import { mapActions, mapState } from "vuex";
import IconDelete from "@/assets/icons/IconDelete.svg?inline";

export default {
  components: {
    Range,
    IconDelete
  },
  computed: {
    ...mapState("ranges", {
      ranges: state => state.ranges,
      activeRangeId: state => state.activeId
    })
  },
  mounted() {
    const ranges = this.ranges;

    if (ranges.length === 0) {
      this.addRange();
    } else {
      this.activateRange(ranges[ranges.length - 1].id);
    }
  },
  methods: {
    ...mapActions("ranges", {
      addRange: "add",
      updateRange: "update",
      removeRange: "remove",
      activateRange: "activate"
    }),

    onClickRangeDelete(rangeId, event) {
      event.stopPropagation();

      this.removeRange(rangeId);
    },

    onRangeClick(rangeId) {
      if (this.activeRangeId !== rangeId) {
        this.activateRange(rangeId);
      }
    },

    onClickAddRange() {
      this.addRange();
    },

    onChangeRange(range) {
      this.updateRange(range);
    }
  }
};
</script>
