const DATASOURCE_SUGGESTIONS =
  "https://geodata.nationaalgeoregister.nl/locatieserver/v3/suggest?fq=type:adres&rows=5";
const DATASOURCE_LOOKUP = "https://geodata.nationaalgeoregister.nl/locatieserver/v3/lookup";

export const mutations = {
  saveResolved(state, resolved) {
    if (state.resolved.filter(resolved => resolved.id === resolved.id).length === 0) {
      state.resolved.push(resolved);
    }
  }
};

export const getters = {
  getResolvedById: state => id => state.resolved.find(resolved => resolved.id === id)
};

export const actions = {
  async search({ dispatch }, query) {
    const url = new URL(DATASOURCE_SUGGESTIONS);

    url.searchParams.append("q", query);

    const request = {
      method: "GET"
    };

    try {
      const response = await fetch(url, request);

      if (response.ok) {
        const result = await response.json();

        return result.response.docs.map(suggestion => ({
          id: suggestion.id,
          label: suggestion.weergavenaam
        }));
      } else {
        dispatch("reportError", new Error("Invalid server response"), { root: true });

        return [];
      }
    } catch (error) {
      dispatch("reportError", new Error("Unable to perform network call"), { root: true });

      return [];
    }
  },

  async resolve({ state, getters, commit, dispatch }, id) {
    const resolved = getters.getResolvedById(state, id);
    const defaultValue = null;

    if (resolved) {
      return resolved;
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

      if (result.response.docs[0]) {
        const resolved = {
          id,
          value: result.response.docs[0].centroide_ll
            .replace("POINT(", "")
            .replace(")", "")
            .split(" ")
            .map(coord => parseFloat(coord))
            .reduce((acc, value, index) => {
              acc[index === 0 ? "lng" : "lat"] = value;
              return acc;
            }, {}),
          label: result.response.docs[0].weergavenaam
        };

        commit("saveResolved", resolved);

        return resolved;
      }
    } catch (error) {
      dispatch("reportError", new Error("Invalid response format"), { root: true });

      return defaultValue;
    }
  }
};

export default {
  namespaced: true,
  state: {
    types: [
      { value: "home", label: "Home" },
      { value: "transport", label: "Station" },
      { value: "health", label: "Health" },
      { value: "work", label: "Work" },
      { value: "education", label: "School" },
      { value: "wellness", label: "Gym" }
    ],
    resolved: []
  },
  getters,
  mutations,
  actions
};
