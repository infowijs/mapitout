<template>
  <div class="ranges">
    <ul>
      <li
        v-for="range in ranges"
        :key="range.id"
        :class="{ active: range.id === activeRangeId }"
        @click="onRangeClick(range.id)"
      >
        <div class="item">
          <range :isDisabled="range.id !== activeRangeId" :value="range" @input="onRangeInput" />
          <button
            class="delete"
            v-if="ranges.length > 1 && range.id !== activeRangeId"
            @click="onClickRangeDelete(range.id, $event)"
          >
            <icon-delete class="icon" />
          </button>
        </div>
      </li>
    </ul>
    <button class="add" @click="onClickAddRange" v-if="ranges.length < 3">
      New Range
    </button>
  </div>
</template>
<style scoped lang="scss">
@import "../style/variables";

.ranges {
  background-color: white;
  overflow: scroll;

  ul {
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      background-color: rgba($greyscale-1, 0.4);
      padding: 2px 0;
      min-height: 76px;

      &:first-child {
        padding-top: 0;
      }

      &:last-child {
        padding-bottom: 0;
      }

      &:not(.active) {
        .item {
          height: auto;
          display: flex;
          flex-direction: row;
          align-items: stretch;
          background: white;

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
  }
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
    if (this.ranges.length === 0) {
      this.addRange();
    }
  },
  methods: {
    ...mapActions("ranges", {
      addRange: "add",
      removeRange: "remove",
      updateRange: "update",
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

    onRangeInput(range) {
      this.updateRange(range);
    },

    onClickAddRange() {
      this.addRange();
    }
  }
};
</script>
