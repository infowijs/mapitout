export const DEFAULT_RANGE = {
  id: "range-0",
  originType: "home",
  originId: "",
  originAddress: "",
  originLat: null,
  originLng: null,
  transportType: "public_transport",
  travelTime: 45,
  departureTime: new Date().toISOString()
};

export const mutations = {
  add(state) {
    let index = 0;
    let id = `range-${index}`;

    while (state.ranges.find(range => range.id === id)) {
      id = `range-${index++}`;
    }
    state.ranges.push({
      ...DEFAULT_RANGE,
      id
    });
  },

  update(state, updatedRange) {
    state.ranges = state.ranges.map(range => {
      if (range.id === updatedRange.id) {
        return updatedRange;
      }

      return range;
    });
  },

  remove(state, id) {
    if (state.ranges.length > 1) {
      state.ranges = state.ranges.filter(range => range.id !== id);
    }
  },

  activate(state, id) {
    state.activeId = id;
  }
};

export const actions = {
  add({ commit, state }) {
    commit("add");

    commit("activate", state.ranges[state.ranges.length - 1].id);
  },

  update({ commit }, range) {
    commit("update", range);
  },

  remove({ commit }, id) {
    commit("remove", id);
  },

  activate({ commit }, id) {
    commit("activate", id);
  }
};

export default {
  namespaced: true,
  state: {
    activeId: "",
    ranges: []
  },
  mutations,
  actions
};
