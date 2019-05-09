import { mutations, getters, actions } from "../../../../src/store/modules/pois";
import { http } from "../../../../src/utils";

jest.mock("../../../../src/utils", () => {
  return {
    http: jest.fn()
  };
});

describe("pois store module", () => {
  describe("mutations", () => {
    describe("replace", () => {
      it("should replace the state pois with the passed value", () => {
        const state = { pois: [] };
        const pois = { name: "test-name", coordinates: {} };

        mutations.replace(state, pois);

        expect(state.pois).toEqual(pois);
      });
    });
  });

  describe("getters", () => {
    describe("getPoiIconByPoiTypeId", () => {
      const poiType = { id: 0, icon: "icon" };
      const state = { poiTypes: [poiType] };

      it("should return the icon of the poi type stored in the state by value passed type id", () => {
        const result = getters.getPoiIconByPoiTypeId(state)(poiType.id);

        expect(result).toEqual(poiType.icon);
      });

      it("should return undefined if the requested id was not saved into the state", () => {
        const result = getters.getPoiIconByPoiTypeId(state)("other-id");

        expect(result).toBeUndefined();
      });
    });
  });

  describe("actions", () => {
    const context = {
      dispatch: jest.fn(),
      commit: jest.fn(),
      getters: {
        getPoiIconByPoiTypeId: jest.fn(),
        getOriginById: jest.fn()
      },
      rootState: {
        filters: {
          filters: []
        }
      },
      rootGetters: {
        "areas/unionArea": undefined
      }
    };

    beforeEach(() => {
      jest.resetAllMocks();
    });

    describe("fetch", () => {
      it("should commit an empty poi array whenever the state selected filters are empty", () => {
        actions.fetch({
          ...context,
          rootGetters: {
            "areas/unionArea": {}
          }
        });

        expect(context.commit).toHaveBeenCalledWith("replace", []);
      });

      it("should commit an empty poi array whenever the state union area is undefined", () => {
        actions.fetch({
          ...context,
          rootState: {
            filters: {
              filters: [{ id: 0, selected: true }]
            }
          }
        });

        expect(context.commit).toHaveBeenCalledWith("replace", []);
      });

      it("should call http with the correct request object whenever root filters are selected", () => {
        http.mockResolvedValue({});

        actions.fetch({
          ...context,
          rootGetters: {
            "areas/unionArea": {
              paths: [[{ lat: 1, lng: 2 }, { lat: 3, lng: 4 }, { lat: 5, lng: 6 }]]
            }
          },
          rootState: {
            filters: {
              filters: [{ id: 0, root: true, value: "test", selected: true }]
            }
          }
        });

        expect(http).toHaveBeenCalledTimes(1);
        expect(http.mock.calls[0][1]).toEqual({
          body:
            '{"poi_in_polygon":{"type":"Feature","geometry":{"type":"MultiPolygon","coordinates":[[[[2,1],[4,3],[6,5]]]],"crs":{"type":"name","properties":{"name":"EPSG:4326"}}}},"poi_by_type":["test"]}',
          headers: {
            Accept: "application/json",
            "Content-type": "application/json; charset=utf-8"
          },
          method: "POST"
        });
      });

      it("should call http with the correct request object whenever property filters are selected", () => {
        http.mockResolvedValue({});

        actions.fetch({
          ...context,
          rootGetters: {
            "areas/unionArea": {
              paths: [[{ lat: 1, lng: 2 }, { lat: 3, lng: 4 }, { lat: 5, lng: 6 }]]
            }
          },
          rootState: {
            filters: {
              filters: [{ id: 0, propertyId: 2, value: "test", selected: true }]
            }
          }
        });

        expect(http).toHaveBeenCalledTimes(1);
        expect(http.mock.calls[0][1]).toEqual({
          body:
            '{"poi_in_polygon":{"type":"Feature","geometry":{"type":"MultiPolygon","coordinates":[[[[2,1],[4,3],[6,5]]]],"crs":{"type":"name","properties":{"name":"EPSG:4326"}}}},"poi_by_property":["test"]}',
          headers: {
            Accept: "application/json",
            "Content-type": "application/json; charset=utf-8"
          },
          method: "POST"
        });
      });

      it("should commit a populated poi array whenever the http call returns a valid json", async () => {
        const poi = { name: "test" };
        const expectedResult = [[poi]];

        http.mockResolvedValue(expectedResult);

        await actions.fetch({
          ...context,
          rootGetters: {
            "areas/unionArea": {
              paths: [[{ lat: 1, lng: 2 }, { lat: 3, lng: 4 }, { lat: 5, lng: 6 }]]
            }
          },
          rootState: {
            filters: {
              filters: [{ id: 0, propertyId: 2, value: "test", selected: true }]
            }
          }
        });
        expect(context.commit).toHaveBeenCalledTimes(1);
        expect(context.commit).toHaveBeenCalledWith("replace", [poi]);
      });

      it("should commit an empty poi array whenever the http call returns an empty json", async () => {
        http.mockResolvedValue({});

        await actions.fetch({
          ...context,
          rootGetters: {
            "areas/unionArea": {
              paths: [[{ lat: 1, lng: 2 }, { lat: 3, lng: 4 }, { lat: 5, lng: 6 }]]
            }
          },
          rootState: {
            filters: {
              filters: [{ id: 0, propertyId: 2, value: "test", selected: true }]
            }
          }
        });
        expect(context.commit).toHaveBeenCalledTimes(1);
        expect(context.commit).toHaveBeenCalledWith("replace", []);
      });

      it("should commit an empty poi array and call dispatch an error whenever the http call fails", async () => {
        http.mockRejectedValue(new Error());

        await actions.fetch({
          ...context,
          rootGetters: {
            "areas/unionArea": {
              paths: [[{ lat: 1, lng: 2 }, { lat: 3, lng: 4 }, { lat: 5, lng: 6 }]]
            }
          },
          rootState: {
            filters: {
              filters: [{ id: 0, propertyId: 2, value: "test", selected: true }]
            }
          }
        });

        expect(context.commit).toHaveBeenCalledTimes(1);
        expect(context.commit).toHaveBeenCalledWith("replace", []);
        expect(context.dispatch).toHaveBeenCalledTimes(1);
        expect(context.dispatch.mock.calls[0][0]).toBe("errors/network");
        expect(context.dispatch.mock.calls[0][1]).toBeInstanceOf(Error);
        expect(context.dispatch.mock.calls[0][2]).toEqual({ root: true });
      });
    });

    describe("lookup", () => {
      it("should call http with the correct request object", () => {
        const name = "test name";
        actions.lookup(context, name);

        expect(http).toHaveBeenCalledTimes(1);

        expect(http.mock.calls[0][1]).toEqual({
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-type": "application/json; charset=utf-8"
          },
          body: `{"poi_by_name":"${name}"}`
        });
      });

      it("should return a details object provided a valid http call response ", async () => {
        const name = "test-query";
        const response = {
          description: "description",
          city: "Amsterdam",
          street: "street",
          postalcode: "postalcode",
          website: "website",
          phone: 2141234,
          poi_type_id: 1,
          geo_location: {
            coordinates: [1, 2]
          }
        };
        const icon = "icon";

        context.getters.getPoiIconByPoiTypeId.mockReturnValue(icon);

        http.mockResolvedValue([[response]]);

        const result = await actions.lookup(context, name);

        expect(result).toEqual({
          name: response.name,
          description: response.description,
          address: `${response.street}, ${response.postalcode} ${response.city}`,
          website: response.website,
          phone: response.phone,
          lng: response.geo_location.coordinates[0],
          lat: response.geo_location.coordinates[1],
          icon
        });
      });

      it("should commit a null details object provided an empty http call response ", async () => {
        const name = "test-query";

        http.mockResolvedValue({});

        const result = await actions.lookup(context, name);

        expect(result).toBeNull();
      });

      it("should return a null details object and dispatch an error on a failed http call", async () => {
        const query = "test-query";

        http.mockRejectedValue(new Error());

        const result = await actions.lookup(context, query);

        expect(result).toBeNull();
        expect(context.dispatch).toBeCalledTimes(1);
        expect(context.dispatch.mock.calls[0][0]).toBe("errors/network");
        expect(context.dispatch.mock.calls[0][1]).toBeInstanceOf(Error);
        expect(context.dispatch.mock.calls[0][2]).toEqual({ root: true });
      });
    });
  });
});
