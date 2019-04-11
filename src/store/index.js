import Vue from "vue";
import Vuex from "vuex";
import qs from "qs";
import { isEqual, omit } from "lodash-es";

import locations from "./modules/locations";
import ranges from "./modules/ranges";
import areas from "./modules/areas";
import filters from "./modules/filters";
import router from "../router";

Vue.use(Vuex);

export const mutations = {
  error(state, payload) {
    state.error = payload;
  }
};

export const actions = {
  reportError({ commit }, error) {
    commit("error", error.message);
  }
};

const store = new Vuex.Store({
  state: {
    error: ""
  },
  modules: {
    locations,
    ranges,
    areas,
    filters
  },
  mutations,
  actions
});

store.watch(
  state => state.ranges.ranges,
  (newValue, oldValue) => {
    const newDefinedOrigins = newValue
      .filter(range => range.originLat && range.originLng)
      .map(range => omit(range, ["originType"]));

    const oldDefinedOrigins = oldValue
      .filter(range => range.originLat && range.originLng)
      .map(range => omit(range, ["originType"]));

    if (!isEqual(newDefinedOrigins, oldDefinedOrigins)) {
      store.dispatch("areas/fetch", newValue.filter(range => range.originLat && range.originLng));
    }
  }
);

store.watch(
  state => state.areas.areas,
  (areas, oldValue) => {
    const filters = store.state.filters.filters.filter(filter => filter.selected);

    if (!isEqual(areas, oldValue) && filters.length > 0) {
      store.dispatch("locations/fetch", { filters, areas });
    }
  }
);

store.watch(
  state => state.filters.filters,
  (newValue, oldValue) => {
    if (!isEqual(newValue, oldValue) && store.state.areas.areas.length > 0) {
      store.dispatch("locations/fetch", {
        filters: newValue.filter(filter => filter.selected),
        areas: store.state.areas.areas
      });
    }
  }
);

store.watch(
  state => state.filters.filters,
  filters => {
    const selectedFilterIds = filters.filter(filter => filter.selected).map(filter => filter.id);

    router.push({
      query: {
        ...router.currentRoute.query,
        filters: selectedFilterIds.length > 0 ? qs.stringify(selectedFilterIds) : undefined
      }
    });
  }
);

store.watch(
  state => state.ranges.ranges,
  (newValue, oldValue) => {
    const newDefinedRanges = newValue
      .filter(range => range.originLat && range.originLng)
      .map(range => omit(range, ["id"]));

    const oldDefinedRanges = oldValue
      .filter(range => range.originLat && range.originLng)
      .map(range => omit(range, ["id"]));

    if (!isEqual(newDefinedRanges, oldDefinedRanges)) {
      router.push({
        query: {
          ...router.currentRoute.query,
          ranges: newDefinedRanges.length > 0 ? qs.stringify(newDefinedRanges) : undefined
        }
      });
    }
  }
);

export default store;
