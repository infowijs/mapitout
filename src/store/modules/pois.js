import IconTransport from "@/assets/icons/IconBus.svg";
import IconEducation from "@/assets/icons/IconEducation.svg";

import { http } from "../../utils";

import { isArray } from "lodash-es";

export const getters = {
  getPoiIconByPoiTypeId: state => id => {
    const poiType = state.poiTypes.find(poiType => poiType.id === id);

    return poiType ? poiType.icon : undefined;
  }
};

export const mutations = {
  replace(state, pois) {
    state.pois = pois;
  }
};

export const actions = {
  async fetch({ dispatch, commit, rootState, rootGetters }) {
    let pois = [];

    const unionArea = rootGetters["areas/unionArea"];
    const selectedFilters = rootState.filters.filters.filter(filter => filter.selected);

    if (unionArea && selectedFilters.length > 0) {
      const requestBody = {
        poi_in_polygon: {
          type: "Feature",
          geometry: {
            type: "MultiPolygon",
            coordinates: unionArea.paths.map(polygon => [
              polygon.map(point => [point.lng, point.lat])
            ]),
            crs: {
              type: "name",
              properties: {
                name: "EPSG:4326"
              }
            }
          }
        }
      };

      const selectedRootFilters = selectedFilters.filter(filter => filter.root);

      if (selectedRootFilters.length > 0) {
        requestBody.poi_by_type = selectedRootFilters.map(filter => filter.value);
      }

      const selectedPropertyFilters = selectedFilters.filter(filter => filter.propertyId);

      if (selectedPropertyFilters.length > 0) {
        requestBody.poi_by_property = selectedPropertyFilters.map(filter => filter.value);
      }

      try {
        const result = await http(process.env.VUE_APP_ENDPOINT_POI_SEARCH, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-type": "application/json; charset=utf-8"
          },
          body: JSON.stringify(requestBody)
        });

        if (isArray(result)) {
          pois = result.map(locationData => locationData[0]);
        }
      } catch (error) {
        dispatch("errors/network", error, { root: true });
      }
    }

    commit("replace", pois);
  },

  async lookup({ dispatch, getters }, locationName) {
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
          icon: getters.getPoiIconByPoiTypeId(result[0][0].poi_type_id)
        };
      }
    } catch (error) {
      dispatch("errors/network", error, { root: true });
    }

    return details;
  }
};

export default {
  namespaced: true,
  state: {
    poiTypes: [
      {
        icon: IconTransport,
        id: 1
      },
      {
        icon: IconEducation,
        id: 2
      }
    ],
    details: null,
    resolved: [],
    pois: []
  },
  getters,
  mutations,
  actions
};
