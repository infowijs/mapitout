<template>
  <div class="panel panel-filters">
    <div class="header">
      <div class="title">
        <icon-arrow-left class="icon" v-if="viewing" @click="onClickBack" />
        <icon-buildings class="icon" v-if="!viewing" />
        <span>{{ viewing ? viewing.name : "Living Essentials" }}</span>
      </div>
      <button class="close" @click="onClickClose">
        <icon-delete class="icon" />
      </button>
    </div>
    <div class="body">
      <div v-if="groups.length === 1">
        <ul class="filter-list">
          <li class="item" v-for="filter in groups[0][1]" :key="filter.value">
            <filter-item
              :filter="filter"
              @click="onFilterItemClick(filter)"
              @toggle="onFilterToggle"
            />
          </li>
        </ul>
      </div>
      <div v-else>
        <ul class="group-list">
          <li class="group" v-for="group in groups" :key="group[0]">
            <button class="group-toggle" @click="visibleGroup = group[0]">{{ group[0] }}</button>
            <ul class="filter-list" v-if="visibleGroup === group[0]">
              <li class="item" v-for="filter in group[1]" :key="filter.value">
                <filter-item
                  :filter="filter"
                  @click="onFilterItemClick(filter)"
                  @toggle="onFilterToggle"
                />
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import "../style/variables.scss";

.close {
  border: 0 none;
  outline: none;
  background-color: transparent;

  .icon {
    color: $greyscale-2;
    width: 16px;
    height: 16px;
  }
  @media (min-width: $breakpoint-tablet-portrait) {
    display: none;
  }
}

.body {
  padding: 24px;
}

.filter-list,
.group-list {
  margin: 0;
  padding: 0;
  list-style: none;

  .item {
    display: flex;
    align-items: center;

    .filter {
      flex-grow: 1;
    }
  }
}

.filter-list {
  .item {
    height: 48px;
    background-color: $greyscale-2;
    padding: 0 24px;
    margin: 6px 0;

    &:first-child {
      margin-top: 0;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
<script>
import IconBuildings from "@/assets/icons/IconBuildings.svg?inline";
import IconDelete from "@/assets/icons/IconDelete.svg?inline";
import IconArrowLeft from "@/assets/icons/IconArrowLeft.svg?inline";
import { mapActions, mapState } from "vuex";
import FilterItem from "./filter/FilterItem";
import { groupBy, toPairs } from "lodash-es";

export default {
  components: {
    IconBuildings,
    IconDelete,
    IconArrowLeft,
    FilterItem
  },

  props: {
    value: Boolean
  },

  computed: {
    ...mapState("filters", ["filters"]),

    groups: function() {
      let filters;

      if (this.viewing) {
        filters = this.filters.filter(filter => filter.parent === this.viewing.id);
      } else {
        filters = this.filters.filter(filter => filter.root);
      }

      return toPairs(groupBy(filters, filter => filter.category));
    }
  },

  data() {
    return {
      visibleGroup: "",
      viewing: null
    };
  },

  methods: {
    ...mapActions("filters", {
      toggleFilter: "toggle"
    }),

    onClickClose() {
      this.$emit("input", !this.value);
    },

    onClickBack() {
      this.viewing = null;
    },

    onFilterItemClick(filter) {
      if (filter.children) {
        this.viewing = filter;
      }
    },

    onFilterToggle(filter, selected) {
      this.toggleFilter({ id: filter.id, selected });
    }
  }
};
</script>
