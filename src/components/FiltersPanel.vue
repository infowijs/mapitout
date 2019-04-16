<template>
  <div class="panel panel-filters">
    <div class="header">
      <div class="title">
        <button class="back" v-if="viewing" @click="onClickBack">
          <icon-arrow-left class="icon" />
        </button>
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
              :value="filter"
              @click="onFilterItemClick(filter)"
              @input="onFilterInput"
            />
          </li>
        </ul>
      </div>
      <div v-else>
        <ul class="group-list">
          <li class="item" v-for="group in groups" :key="group[0].label">
            <button class="group-toggle" @click="visibleGroup = group[0].label">
              <component :is="group[0].icon" class="icon" />
              <span class="label">{{ group[0].label }}</span>
              <caret-down class="icon-toggle" />
            </button>
            <ul class="filter-list" v-if="visibleGroup === group[0].label">
              <li class="item" v-for="filter in group[1]" :key="filter.value">
                <filter-item
                  :value="filter"
                  @click="onFilterItemClick(filter)"
                  @input="onFilterInput"
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

.body {
  padding: 24px;
}

.content {
  height: 300px;
  width: 100%;
}

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

.back {
  outline: 0 none;
  border: 0 none;
  padding: 0;
  background-color: transparent;
  cursor: pointer;
}

.filter-list,
.group-list {
  margin: 0;
  padding: 0;
  list-style: none;
  overflow: scroll;

  .item {
    display: flex;
    flex-direction: column;
    align-items: stretch;

    .filter {
      flex-grow: 1;
    }
  }
}

.group-list {
  padding: 0;
}

.group-toggle {
  background-color: $greyscale-2;
  border: 0 none;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  line-height: 1;
  padding: 0 24px;
  outline: 0 none;

  .icon {
    width: 28px;
    height: 28px;
    margin-right: 16px;
  }

  .label {
    color: $greyscale-1;
    font-size: 14px;
    flex-grow: 1;
    text-align: left;
  }

  .icon-toggle {
    width: 8px;
    height: 4px;
    margin-left: 16px;
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

.group-list {
  .item {
    background-color: white;
    margin: 6px 0;

    &:first-child {
      margin-top: 0;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
  .filter-list {
    .filter::v-deep {
      background-color: white;

      .icon {
        visibility: hidden;
      }
    }
  }
}
</style>
<script>
import IconBuildings from "@/assets/icons/IconBuildings.svg?inline";
import IconDelete from "@/assets/icons/IconDelete.svg?inline";
import IconArrowLeft from "@/assets/icons/IconArrowLeft.svg?inline";
import IconBus from "@/assets/icons/IconBus.svg?inline";
import IconTrain from "@/assets/icons/IconTrain.svg?inline";
import IconTram from "@/assets/icons/IconTram.svg?inline";
import IconSubway from "@/assets/icons/IconSubway.svg?inline";
import IconEducation from "@/assets/icons/IconEducation.svg?inline";
import CaretDown from "@/assets/CaretDown.svg?inline";
import { mapState } from "vuex";
import FilterItem from "./filter/FilterItem";
import { groupBy, toPairs } from "lodash-es";
import qs from "qs";

export default {
  components: {
    IconBuildings,
    IconDelete,
    IconArrowLeft,
    FilterItem,
    IconBus,
    IconTrain,
    IconTram,
    IconSubway,
    IconEducation,
    CaretDown
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

      return toPairs(groupBy(filters, filter => filter.category)).map(group => [
        { label: group[0], icon: group[1][0].icon },
        group[1]
      ]);
    }
  },

  data() {
    return {
      visibleGroup: "",
      viewing: null
    };
  },

  methods: {
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

    onFilterInput(updatedFilter) {
      let filters = this.filters.map(filter => {
        if (filter.id === updatedFilter.id) {
          return updatedFilter;
        }

        return filter;
      });

      this.navigate(filters);
    },

    navigate(filters) {
      const selectedFilters = filters.filter(filter => filter.selected);

      const fQueryString =
        selectedFilters.length > 0
          ? qs.stringify(selectedFilters.map(filter => filter.id))
          : undefined;

      if (this.$route.query.f !== fQueryString) {
        this.$router.push({ query: { ...this.$route.query, f: fQueryString } });
      }
    }
  }
};
</script>
