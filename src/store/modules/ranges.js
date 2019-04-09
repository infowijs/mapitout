export const DEFAULT_RANGE = {
  originType: "home",
  originId: undefined,
  originAddress: "",
  originCoordinates: undefined,
  transportType: "public_transport",
  travelTime: 45,
  highlightColor: "#ff0000"
};

export const getters = {
  rangesWithOrigin: state => state.ranges.filter(range => range.originId)
};

export const mutations = {
  add(state) {
    let index = 0;
    let id = `range-${index}`;

    while (state.ranges.find(range => range.id === id)) {
      id = `range-${index++}`;
    }
    state.ranges.push({
      id,
      ...DEFAULT_RANGE
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
  actions,
  getters
};
