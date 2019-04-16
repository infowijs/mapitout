import { http } from "../../utils";
import { isEqual, omit } from "lodash-es";

export const getters = {
  getAreasFromCache: state => key => {
    const cachedAreaObject = state.cache.find(cachedAreaObject => cachedAreaObject.key === key);

    if (cachedAreaObject) {
      return cachedAreaObject.areas;
    }

    return undefined;
  },

  unionArea: state => state.areas.find(area => area.id === "union")
};

export const mutations = {
  replace(state, areas) {
    state.areas = areas;
  },

  save(state, { key, areas }) {
    if (!state.cache.find(areaObject => areaObject.key === key)) {
      state.cache.push({ key, areas });
    }
  }
};

export const actions = {
  async fetch({ dispatch, commit, getters, rootState, rootGetters }) {
    const ranges = rootState.ranges.ranges
      .filter(range => range.originId)
      .map(range => ({
        ...range,
        transportTypeValue: rootGetters["transports/getTransportValueById"](range.transportTypeId)
      }));

    let areas = [];

    if (ranges.length > 0) {
      const origins = await dispatch("origins/resolveArray", ranges.map(range => range.originId), {
        root: true
      });

      if (isEqual(origins.map(origin => origin.id), ranges.map(range => range.originId))) {
        const cacheKey = ranges
          .map(range => omit(range, ["id", "origin"]))
          .map(range => Object.values(range).join("-"))
          .join(";");
        const cachedAreas = getters.getAreasFromCache(cacheKey);

        if (cachedAreas) {
          areas = cachedAreas;
        } else {
          const requestBody = {
            departure_searches: ranges.map(range => {
              const origin = origins.find(origin => origin.id === range.originId);

              return {
                id: String(range.id),
                coords: {
                  lat: origin.lat,
                  lng: origin.lng
                },
                departure_time: range.departureTime,
                travel_time: range.travelTime * 60,
                transportation: {
                  type: range.transportTypeValue
                }
              };
            }),
            unions: [
              {
                id: "union",
                search_ids: ranges.map(range => `${range.id}`)
              }
            ]
          };

          if (ranges.length > 1) {
            requestBody.intersections = [
              {
                id: "intersection",
                search_ids: ranges.map(range => `${range.id}`)
              }
            ];
          }

          try {
            const result = await http(process.env.VUE_APP_ENDPOINT_AREAS, {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-type": "application/json; charset=utf-8"
              },
              body: JSON.stringify(requestBody)
            });

            areas = result.results.map(timeMap => {
              return {
                id: timeMap.search_id,
                rangeId: parseInt(timeMap.search_id),
                paths: timeMap.shapes.reduce((acc, shape) => {
                  let paths = [shape.shell];

                  if (shape.holes.length > 0) {
                    paths = paths.concat(shape.holes);
                  }

                  return acc.concat(paths);
                }, [])
              };
            });

            commit("save", { key: cacheKey, areas });
          } catch (error) {
            dispatch("errors/network", error, { root: true });
          }
        }
      }
    }

    commit("replace", areas);
  }
};

export default {
  namespaced: true,
  state: {
    mapBoundaries: { north: 53.53, south: 50.74, west: 3.35, east: 7.25 },
    areas: [],
    cache: []
  },
  getters,
  mutations,
  actions
};
