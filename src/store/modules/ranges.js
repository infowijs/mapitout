export const mutations = {
  add(state, range) {
    let id = 0;

    while (state.ranges.find(range => range.id === id)) {
      id++;
    }

    state.ranges.push({ ...range, id });
  },

  activate(state, id) {
    state.activeId = id;
  },

  replace(state, ranges) {
    state.ranges = ranges;
  }
};

export const actions = {
  add({ commit }, range) {
    commit("add", range);
  },

  activate({ commit }, id) {
    commit("activate", id);
  },

  replace({ commit }, ranges) {
    commit("replace", ranges);
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
