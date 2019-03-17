import Vue from "vue";
import Vuex from "vuex";

import address from "./modules/address";

Vue.use(Vuex);

export const mutations = {
  error(state, payload) {
    state.error = payload;
  }
};

export const actions = {
  reportError({ commit }, error) {
    commit("error", error.statusMessage);
  }
};

export default new Vuex.Store({
  state: {
    error: []
  },
  modules: {
    address
  },
  mutations,
  actions
});
