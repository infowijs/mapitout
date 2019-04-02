function getNextMonday9Am() {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + ((1 + 7 - date.getUTCDay()) % 7));
  date.setUTCHours(9, 0, 0, 0);

  return date;
}

export const mutations = {
  update(state, areas) {
    state.areas = areas;
  }
};

export const actions = {
  async fetch({ dispatch, commit }, ranges) {
    const url = new URL(process.env.VUE_APP_ENDPOINT_AREAS);
    let headers = {
      Accept: "application/json",
      "Content-type": "application/json; charset=utf-8"
    };

    const request = {
      method: "POST",
      headers,
      body: JSON.stringify({
        departure_searches: ranges.map(range => {
          return {
            id: range.id,
            coords: {
              lat: range.originCoordinates.lat,
              lng: range.originCoordinates.lng
            },
            departure_time: getNextMonday9Am().toISOString(),
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
      const response = await fetch(url.toString(), request);

      if (response.ok) {
        const result = await response.json();

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
      } else {
        dispatch("reportError", new Error("Invalid server response"), { root: true });
      }
    } catch (error) {
      dispatch("reportError", new Error("Unable to perform network call"), { root: true });
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
