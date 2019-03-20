const DATASOURCE_SUGGESTIONS =
  "https://geodata.nationaalgeoregister.nl/locatieserver/v3/suggest?fq=type:adres&rows=5";
const DATASOURCE_LOOKUP = "https://geodata.nationaalgeoregister.nl/locatieserver/v3/lookup";

export const mutations = {
  saveResolved(state, address) {
    if (state.resolved.filter(resolved => resolved.id === address.id).length === 0) {
      state.resolved.push(address);
    }
  }
};

export const getters = {
  getResolvedById: (state, id) => state.resolved.find(address => address.id === id)
};

export const actions = {
  async search({ dispatch }, query) {
    const url = new URL(DATASOURCE_SUGGESTIONS);

    url.searchParams.append("q", query);

    const request = {
      method: "GET"
    };

    const response = await fetch(url, request);

    if (!response.ok) {
      dispatch("reportError", new Error("Server error"), { root: true });

      return [];
    }

    try {
      const result = await response.json();

      return result.response.docs.map(suggestion => {
        return {
          id: suggestion.id,
          address: suggestion.weergavenaam
        };
      });
    } catch (error) {
      dispatch("reportError", new Error("Invalid response format"), { root: true });

      return [];
    }
  },

  async resolve({ dispatch, getters, commit }, id) {
    const resolved = getters.getResolvedById(id);
    const defaultValue = null;

    if (resolved) {
      return resolved.coordinates;
    }

    const url = new URL(DATASOURCE_LOOKUP);

    url.searchParams.append("id", id);

    const request = {
      method: "GET"
    };

    const response = await fetch(url, request);

    if (!response.ok) {
      dispatch("reportError", new Error("Server error"), { root: true });

      return defaultValue;
    }

    try {
      const result = await response.json();
      let coordString = result.response.docs[0].centroide_ll;
      const coordArray = coordString
        .replace("POINT(", "")
        .replace(")", "")
        .split(" ");
      const coordinates = { lat: parseFloat(coordArray[1]), lng: parseFloat(coordArray[0]) };
      commit("saveResolved", { id, coordinates });

      return coordinates;
    } catch (error) {
      dispatch("reportError", new Error("Invalid response format"), { root: true });

      return defaultValue;
    }
  }
};

export default {
  namespaced: true,
  state: {
    resolved: []
  },
  getters,
  mutations,
  actions
};
