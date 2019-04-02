import Vue from "vue";
import Vuex from "vuex";

import locations from "./modules/locations";
import ranges from "./modules/ranges";
import areas from "./modules/areas";

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

export default new Vuex.Store({
  state: {
    error: ""
  },
  modules: {
    locations,
    ranges,
    areas
  },
  mutations,
  actions
});
