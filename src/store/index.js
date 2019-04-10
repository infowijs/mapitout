import Vue from "vue";
import Vuex from "vuex";

import locations from "./modules/locations";
import ranges from "./modules/ranges";
import areas from "./modules/areas";
import filters from "./modules/filters";
import { isEqual, pick } from "lodash-es";

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
      .map(range => pick(range, ["id", "originLat", "originLng", "transportType", "travelTime"]));

    const oldDefinedOrigins = oldValue
      .filter(range => range.originLat && range.originLng)
      .map(range => pick(range, ["id", "originLat", "originLng", "transportType", "travelTime"]));

    if (!isEqual(newDefinedOrigins, oldDefinedOrigins)) {
      store.dispatch("areas/fetch", newValue);
    }
  }
);

store.watch(
  state => state.areas.areas,
  (newValue, oldValue) => {
    const selectedFilters = store.state.filters.filters.filter(filter => filter.selected);

    if (!isEqual(newValue, oldValue) && selectedFilters.length > 0) {
      store.dispatch("locations/fetch", selectedFilters, newValue);
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

export default store;
