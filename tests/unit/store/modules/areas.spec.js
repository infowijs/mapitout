import { getters, mutations, actions } from "@/store/modules/areas";
import { http } from "../../../../src/utils";

jest.mock("../../../../src/utils", () => {
  return {
    http: jest.fn()
  };
});

describe("areas store module", () => {
  describe("getters", () => {
    describe("getAreasFromCache", () => {
      let state;

      beforeEach(() => {
        state = {
          cache: [{ key: "key", areas: [{ id: 0 }] }]
        };
      });

      it("should return the state stored areas by cache-key", () => {
        const result = getters.getAreasFromCache(state)("key");

        expect(result).toEqual(state.cache[0].areas);
      });

      it("should return undefined for an invalid cache key", () => {
        const result = getters.getAreasFromCache(state)("key2");

        expect(result).toBeUndefined();
      });
    });

    describe("unionArea", () => {
      const unionArea = { id: "union", areas: [{ id: 0 }] };

      it("should return the area with the id union from state", () => {
        const result = getters.unionArea({
          areas: [unionArea]
        });

        expect(result).toEqual(unionArea);
      });

      it("should return undefined for no union area found", () => {
        const result = getters.unionArea({
          areas: []
        });

        expect(result).toBeUndefined();
      });
    });
  });

  describe("mutations", () => {
    describe("replace", () => {
      it("should replace the state areas", () => {
        const areas = [{ id: "area-0" }];
        const state = {
          areas: []
        };

        mutations.replace(state, areas);

        expect(state.areas).toEqual(areas);
      });
    });

    describe("save", () => {
      it("should save the areas to the state cache", () => {
        const areas = [{ id: "area-0" }];
        const key = "key";
        const state = {
          cache: []
        };

        mutations.save(state, { key, areas });

        expect(state.cache).toEqual([{ key, areas }]);
      });

      it("should not add duplicate keys to the cache", () => {
        const areas1 = [{ id: "area-0" }];
        const key = "key";
        const state = {
          cache: [{ key, areas: areas1 }]
        };

        mutations.save(state, { key, areas: { id: "area-2" } });

        expect(state.cache).toEqual([{ key, areas: areas1 }]);
      });
    });
  });

  describe("actions", () => {
    const context = {
      dispatch: jest.fn(),
      commit: jest.fn(),
      getters: {
        getAreasFromCache: jest.fn()
      },
      rootGetters: {
        "transports/getTransportValueById": jest.fn()
      },
      rootState: {
        ranges: {
          ranges: []
        }
      }
    };

    const departureTime = new Date().toISOString();

    const origins = [{ id: "origin-0" }, { id: "origin-1" }];
    const ranges = [
      {
        id: 0,
        originTypeId: 0,
        originId: "origin-0",
        travelTime: 45,
        transportTypeId: 0,
        departureTime
      },
      {
        id: 1,
        originTypeId: 1,
        originId: "origin-1",
        travelTime: 20,
        transportTypeId: 1,
        departureTime
      }
    ];

    beforeEach(() => {
      jest.resetAllMocks();
    });

    describe("fetch", () => {
      it("should commit an empty areas array when there are no ranges with defined origins in state", async () => {
        await actions.fetch({
          ...context,
          rootState: {
            ranges: {
              ranges: []
            }
          }
        });

        expect(context.commit).toHaveBeenCalledTimes(1);
        expect(context.commit).toHaveBeenCalledWith("replace", []);
      });
      it("should commit an empty areas array when origin resolving fails", async () => {
        context.dispatch.mockResolvedValue([]);

        await actions.fetch({
          ...context,
          rootState: {
            ranges: {
              ranges: [{ ...ranges[0] }]
            }
          }
        });

        expect(context.commit).toHaveBeenCalledTimes(1);
        expect(context.commit).toHaveBeenCalledWith("replace", []);
      });

      it("should commit the cached areas if found in state cache", async () => {
        const areas = [{ id: 0 }];

        context.dispatch.mockResolvedValue([{ ...origins[0] }]);
        context.getters.getAreasFromCache.mockReturnValue(areas);

        await actions.fetch({
          ...context,
          rootState: {
            ranges: {
              ranges: [{ ...ranges[0] }]
            }
          }
        });

        expect(context.commit).toHaveBeenCalledTimes(1);
        expect(context.commit).toHaveBeenCalledWith("replace", areas);
      });

      it("should call http with the correct request object for one range", async () => {
        context.dispatch.mockResolvedValue([{ ...origins[0] }]);
        context.getters.getAreasFromCache.mockReturnValue(undefined);
        http.mockResolvedValue({ results: [] });

        await actions.fetch({
          ...context,
          rootState: {
            ranges: {
              cache: [],
              ranges: [{ ...ranges[0] }]
            }
          }
        });

        expect(http).toHaveBeenCalledTimes(1);
        expect(http.mock.calls[0][1]).toEqual({
          body: `{"departure_searches":[{"id":"0","coords":{},"departure_time":"${departureTime}","travel_time":2700,"transportation":{}}],"unions":[{"id":"union","search_ids":["0"]}]}`,
          headers: {
            Accept: "application/json",
            "Content-type": "application/json; charset=utf-8"
          },
          method: "POST"
        });
      });

      it("should call http with the correct request object for two or more ranges", async () => {
        context.dispatch.mockResolvedValue([...origins]);
        context.getters.getAreasFromCache.mockReturnValue(undefined);
        http.mockResolvedValue({ results: [] });

        await actions.fetch({
          ...context,
          rootState: {
            ranges: {
              cache: [],
              ranges: [...ranges]
            }
          }
        });

        expect(http).toHaveBeenCalledTimes(1);
        expect(http.mock.calls[0][1]).toEqual({
          body: `{"departure_searches":[{"id":"0","coords":{},"departure_time":"${departureTime}","travel_time":2700,"transportation":{}},{"id":"1","coords":{},"departure_time":"${departureTime}","travel_time":1200,"transportation":{}}],"unions":[{"id":"union","search_ids":["0","1"]}],"intersections":[{"id":"intersection","search_ids":["0","1"]}]}`,
          headers: {
            Accept: "application/json",
            "Content-type": "application/json; charset=utf-8"
          },
          method: "POST"
        });
      });

      it("should commit to areas and cache whenever a valid response is returned", async () => {
        context.dispatch.mockResolvedValue([...origins]);
        context.getters.getAreasFromCache.mockReturnValue(undefined);
        http.mockResolvedValue({
          results: [
            {
              search_id: "0",
              shapes: [
                {
                  shell: [{}],
                  holes: [[{}], [{}]]
                }
              ]
            }
          ]
        });

        await actions.fetch({
          ...context,
          rootState: {
            ranges: {
              cache: [],
              ranges: [...ranges]
            }
          }
        });

        expect(context.commit).toHaveBeenCalledTimes(2);

        expect(context.commit.mock.calls[0]).toEqual([
          "save",
          {
            key: `0-origin-0-45-0-${departureTime}-;1-origin-1-20-1-${departureTime}-`,
            areas: [{ id: "0", paths: [[{}], [{}], [{}]], rangeId: 0 }]
          }
        ]);

        expect(context.commit.mock.calls[1]).toEqual([
          "replace",
          [{ id: "0", paths: [[{}], [{}], [{}]], rangeId: 0 }]
        ]);
      });

      it("should commit to areas and cache whenever a valid response is returned", async () => {
        context.dispatch.mockResolvedValue([{ ...origins[0] }]);
        context.getters.getAreasFromCache.mockReturnValue(undefined);
        http.mockRejectedValue(new Error());

        await actions.fetch({
          ...context,
          rootState: {
            ranges: {
              cache: [],
              ranges: [{ ...ranges[0] }]
            }
          }
        });

        expect(context.dispatch).toHaveBeenCalledTimes(2);

        expect(context.dispatch.mock.calls[1][0]).toBe("errors/network");
        expect(context.dispatch.mock.calls[1][1]).toBeInstanceOf(Error);
        expect(context.dispatch.mock.calls[1][2]).toEqual({ root: true });
      });
    });
  });
});
