import IconHome from "@/assets/icons/IconHome.svg";
import IconTransport from "@/assets/icons/IconBus.svg";
import IconHealth from "@/assets/icons/IconHealth.svg";
import IconWork from "@/assets/icons/IconWork.svg";
import IconEducation from "@/assets/icons/IconEducation.svg";
import IconWellness from "@/assets/icons/IconWellness.svg";

import { http } from "../../utils";

export const getters = {
  getOriginById: state => id => state.origins.find(origin => origin.id === id),

  getOriginIconByOriginTypeId: state => id => {
    const originType = state.types.find(originType => originType.id === id);

    return originType ? originType.icon : undefined;
  },

  getOriginIconComponentByOriginTypeId: state => id => {
    const originType = state.types.find(originType => originType.id === id);

    return originType ? originType.iconComponent : undefined;
  },

  getOriginHighlightColorByOriginTypeId: state => id => {
    const originType = state.types.find(originType => originType.id === id);

    return originType ? originType.highlightColor : undefined;
  }
};

export const mutations = {
  save(state, newOrigin) {
    if (!state.origins.find(origin => origin.id === newOrigin.id)) {
      state.origins.push(newOrigin);
    }
  }
};

export const actions = {
  async lookup({ dispatch }, query) {
    const url = new URL(process.env.VUE_APP_ENDPOINT_ADDRESS_SEARCH);

    url.searchParams.append("q", query);

    const request = {
      method: "GET"
    };

    let suggestions = [];

    try {
      const result = await http(url, request);

      suggestions = result.response.docs.map(suggestion => ({
        id: suggestion.id,
        address: suggestion.weergavenaam
      }));
    } catch (error) {
      dispatch("errors/network", error, { root: true });
    }

    return suggestions;
  },

  async resolve({ getters, commit, dispatch }, id) {
    let origin = getters.getOriginById(id);

    if (origin) {
      return origin;
    }

    const url = new URL(process.env.VUE_APP_ENDPOINT_GEOLOCATION);

    url.searchParams.append("id", id);

    const request = {
      method: "GET"
    };

    origin = null;

    try {
      const result = await http(url, request);
      const coordinates = result.response.docs[0].centroide_ll
        .replace("POINT(", "")
        .replace(")", "")
        .split(" ")
        .map(coord => parseFloat(coord));

      if (result.response.docs[0]) {
        origin = {
          id,
          lng: coordinates[0],
          lat: coordinates[1],
          address: result.response.docs[0].weergavenaam
        };

        commit("save", origin);
      }
    } catch (error) {
      dispatch("errors/network", error, { root: true });
    }

    return origin;
  },

  async resolveArray({ dispatch }, ids) {
    let origins = await Promise.all(ids.map(id => dispatch("resolve", id)));

    origins = origins.filter(origin => origin);

    if (origins.length === ids.length) {
      return origins;
    }

    return [];
  }
};

export default {
  namespaced: true,
  state: {
    types: [
      {
        id: 0,
        value: "home",
        label: "Home",
        icon: IconHome,
        iconComponent: "icon-home",
        highlightColor: "#ff0000"
      },
      {
        id: 1,
        value: "transport",
        label: "Station",
        icon: IconTransport,
        iconComponent: "icon-transport",
        highlightColor: "#fd6500"
      },
      {
        id: 2,
        value: "health",
        label: "Health",
        icon: IconHealth,
        iconComponent: "icon-health",
        highlightColor: "#87c010"
      },
      {
        id: 3,
        value: "work",
        label: "Work",
        icon: IconWork,
        iconComponent: "icon-work",
        highlightColor: "#ff0000"
      },
      {
        id: 4,
        value: "education",
        label: "School",
        icon: IconEducation,
        iconComponent: "icon-education",
        highlightColor: "#0c65d5"
      },
      {
        id: 5,
        value: "wellness",
        label: "Gym",
        icon: IconWellness,
        iconComponent: "icon-wellness",
        highlightColor: "#942190"
      }
    ],
    origins: []
  },
  getters,
  mutations,
  actions
};
