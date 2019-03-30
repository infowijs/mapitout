import IconHome from "@/assets/icons/IconHome.svg";
import IconTransport from "@/assets/icons/IconTransport.svg";
import IconHealth from "@/assets/icons/IconHealth.svg";
import IconWork from "@/assets/icons/IconWork.svg";
import IconEducation from "@/assets/icons/IconEducation.svg";
import IconWellness from "@/assets/icons/IconWellness.svg";

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
  async searchByAddress({ dispatch }, query) {
    const url = new URL(process.env.VUE_APP_ENDPOINT_ADDRESS_SEARCH);

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
    const defaultValue = {
      id: undefined,
      label: "",
      value: null
    };

    if (resolved) {
      return resolved;
    }

    const url = new URL(process.env.VUE_APP_ENDPOINT_GEOLOCATION);

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
      { value: "home", label: "Home", icon: IconHome, highlightColor: "#ff0000" },
      { value: "transport", label: "Station", icon: IconTransport, highlightColor: "#fd6500" },
      { value: "health", label: "Health", icon: IconHealth, highlightColor: "#87c010" },
      { value: "work", label: "Work", icon: IconWork, highlightColor: "#ff0000" },
      { value: "education", label: "School", icon: IconEducation, highlightColor: "#0c65d5" },
      { value: "wellness", label: "Gym", icon: IconWellness, highlightColor: "#942190" }
    ],
    resolved: []
  },
  getters,
  mutations,
  actions
};
