import Vue from "vue";
import Vuex from "vuex";
import qs from "qs";
import { isEqual, omit } from "lodash-es";

import errors from "./modules/errors";
import pois from "./modules/pois";
import ranges from "./modules/ranges";
import areas from "./modules/areas";
import filters from "./modules/filters";
import origins from "./modules/origins";
import transports from "./modules/transports";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    error: ""
  },
  modules: {
    origins,
    pois,
    ranges,
    areas,
    filters,
    transports,
    errors
  }
});

store.watch(
  state => state.route,
  async route => {
    const ranges = Object.values(qs.parse(route.query.r)).map(range => ({
      id: parseInt(range.id),
      originTypeId: parseInt(range.otId),
      originId: range.oId,
      origin: range.o,
      transportTypeId: parseInt(range.ttId),
      travelTime: parseInt(range.tt),
      departureTime: new Date(parseInt(range.t)).toISOString()
    }));

    const filters = Object.values(qs.parse(route.query.f)).map(selectedFilterId =>
      parseInt(selectedFilterId)
    );

    if (!isEqual(ranges, store.state.ranges.ranges.filter(range => range.originId))) {
      await store.dispatch("ranges/replace", ranges);
    }

    if (
      !isEqual(
        filters,
        store.state.filters.filters.filter(filter => filter.selected).map(filter => filter.id)
      )
    ) {
      await store.dispatch("filters/select", filters);
    }
  }
);

store.watch(
  state => state.ranges.ranges,
  (newRanges, oldRanges) => {
    const [newValue, oldValue] = [newRanges, oldRanges].map(ranges =>
      ranges.map(range => omit(range, ["originTypeId"]))
    );

    if (!isEqual(newValue, oldValue)) {
      store.dispatch("areas/fetch");
    }
  }
);

store.watch(
  state => state.areas.areas,
  (newAreas, oldAreas) => {
    if (!isEqual(newAreas, oldAreas)) {
      store.dispatch("pois/fetch");
    }
  }
);

store.watch(
  state => state.filters.filters,
  (newFilters, oldFilters) => {
    if (!isEqual(newFilters, oldFilters)) {
      store.dispatch("pois/fetch");
    }
  }
);

export default store;
