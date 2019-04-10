import { http } from "../../utils";

export const mutations = {
  update(state, areas) {
    state.areas = areas;
  }
};

export const actions = {
  async fetch({ dispatch, commit }, ranges) {
    const url = new URL(process.env.VUE_APP_ENDPOINT_AREAS);
    const request = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({
        departure_searches: ranges.map(range => {
          return {
            id: range.id,
            coords: {
              lat: range.originLat,
              lng: range.originLng
            },
            departure_time: range.departureTime.toISOString(),
            travel_time: range.travelTime * 60,
            transportation: {
              type: range.transportType
            }
          };
        }),
        unions: [
          {
            id: "union",
            search_ids: ranges.map(range => range.id)
          }
        ],
        intersections: [
          {
            id: "intersection",
            search_ids: ranges.map(range => range.id)
          }
        ]
      })
    };

    let areas = [];

    try {
      const result = await http(url, request);

      areas = result.results.map((timeMap, index) => {
        return {
          id: `area-${index}`,
          rangeId: timeMap.search_id,
          paths: timeMap.shapes.reduce((acc, shape) => {
            let paths = [shape.shell];

            if (shape.holes.length > 0) {
              paths = paths.concat(shape.holes);
            }

            return acc.concat(paths);
          }, [])
        };
      });
    } catch (error) {
      dispatch("reportError", error, { root: true });
    }

    commit("update", areas);
  }
};

export default {
  namespaced: true,
  state: {
    mapBoundaries: { north: 53.53, south: 50.74, west: 3.35, east: 7.25 },
    areas: []
  },
  mutations,
  actions
};
