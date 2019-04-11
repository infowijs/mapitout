import IconHome from "@/assets/icons/IconHome.svg";
import IconTransport from "@/assets/icons/IconBus.svg";
import IconHealth from "@/assets/icons/IconHealth.svg";
import IconWork from "@/assets/icons/IconWork.svg";
import IconEducation from "@/assets/icons/IconEducation.svg";
import IconWellness from "@/assets/icons/IconWellness.svg";

import { http } from "../../utils";

import { isArray } from "lodash-es";

export const mutations = {
  saveResolved(state, resolved) {
    if (state.resolved.filter(resolved => resolved.id === resolved.id).length === 0) {
      state.resolved.push(resolved);
    }
  },

  updatePois(state, pois) {
    state.pois = pois;
  },

  view(state, details) {
    state.details = details;
  }
};

export const getters = {
  getLocationTypeByValue: state => value => state.types.find(type => type.value === value),
  getLocationTypeById: state => id => state.types.find(type => type.id === id),
  getResolvedById: state => id => state.resolved.find(resolved => resolved.id === id)
};

export const actions = {
  async searchByAddress({ dispatch }, query) {
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
        label: suggestion.weergavenaam
      }));
    } catch (error) {
      dispatch("reportError", error, { root: true });
    }

    return suggestions;
  },

  async resolve({ state, getters, commit, dispatch }, id) {
    let resolved = getters.getResolvedById(state, id);

    if (resolved) {
      return resolved;
    }

    const url = new URL(process.env.VUE_APP_ENDPOINT_GEOLOCATION);

    url.searchParams.append("id", id);

    const request = {
      method: "GET"
    };

    resolved = {
      id: undefined,
      label: "",
      value: null
    };

    try {
      const result = await http(url, request);

      if (result.response.docs[0]) {
        resolved = {
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
      }
    } catch (error) {
      dispatch("reportError", error, { root: true });
    }

    return resolved;
  },

  async fetch({ dispatch, commit }, { filters, areas }) {
    let pois = [];

    if (filters.length > 0 && areas.length > 0) {
      const url = new URL(process.env.VUE_APP_ENDPOINT_POI_SEARCH);

      const request = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({
          poi_by_type: filters.map(filter => filter.value),
          poi_in_polygon: {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: areas
                .find(area => area.rangeId === "union")
                .paths.map(polygon => polygon.map(point => [point.lng, point.lat])),
              crs: {
                type: "name",
                properties: {
                  name: "EPSG:4326"
                }
              }
            }
          }
        })
      };

      try {
        const result = await http(url, request);

        if (isArray(result)) {
          pois = result.map(locationData => locationData[0]);
        }
      } catch (error) {
        dispatch("reportError", error, { root: true });
      }
    }

    commit("updatePois", pois);
  },

  async lookup({ dispatch, commit, getters }, locationName) {
    const url = new URL(process.env.VUE_APP_ENDPOINT_POI_SEARCH);

    const request = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({
        poi_by_name: locationName
      })
    };

    let details = null;

    try {
      const result = await http(url, request);

      if (isArray(result)) {
        details = {
          name: result[0][0].name,
          description: result[0][0].description,
          address: `${result[0][0].street}, ${result[0][0].postalcode} ${result[0][0].city}`,
          website: result[0][0].website,
          phone: result[0][0].phone,
          lng: result[0][0].geo_location.coordinates[0],
          lat: result[0][0].geo_location.coordinates[1],
          icon: getters.getLocationTypeById(result[0][0].poi_type_id).icon
        };
      }
    } catch (error) {
      dispatch("reportError", error, { root: true });
    }

    commit("view", details);
  }
};

export default {
  namespaced: true,
  state: {
    types: [
      { value: "home", label: "Home", icon: IconHome, highlightColor: "#ff0000" },
      {
        value: "transport",
        label: "Station",
        icon: IconTransport,
        highlightColor: "#fd6500",
        id: 1
      },
      { value: "health", label: "Health", icon: IconHealth, highlightColor: "#87c010" },
      { value: "work", label: "Work", icon: IconWork, highlightColor: "#ff0000" },
      {
        value: "education",
        label: "School",
        icon: IconEducation,
        highlightColor: "#0c65d5",
        id: 2
      },
      { value: "wellness", label: "Gym", icon: IconWellness, highlightColor: "#942190" }
    ],
    details: null,
    resolved: [],
    pois: []
  },
  getters,
  mutations,
  actions
};
