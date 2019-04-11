import { mutations, getters, actions } from "../../../../src/store/modules/locations";
import { http } from "../../../../src/utils";

jest.mock("../../../../src/utils", () => {
  return {
    http: jest.fn()
  };
});

describe("locations store module", () => {
  describe("mutations", () => {
    describe("saveResolved", () => {
      it("should add the resolved address to state", () => {
        const state = { resolved: [] };
        const resolved = { id: "test-id", coordinates: {} };

        mutations.saveResolved(state, resolved);

        expect(state.resolved.length).toBe(1);
        expect(state.resolved.includes(resolved)).toBeTruthy();
      });

      it("should skip adding and already resolved address to state", () => {
        const resolved = { id: "test-id", coordinates: {} };
        const resolved2 = { id: "test-id", coordinates: {} };
        const state = { resolved: [resolved] };

        mutations.saveResolved(state, resolved2);

        expect(state.resolved.length).toBe(1);
        expect(state.resolved.includes(resolved)).toBeTruthy();
      });
    });

    describe("updatePois", () => {
      it("should update the state pois with the passed value", () => {
        const state = { pois: [] };
        const pois = { name: "test-name", coordinates: {} };

        mutations.updatePois(state, pois);

        expect(state.pois).toEqual(pois);
      });
    });

    describe("view", () => {
      it("should update the state details with the passed value", () => {
        const state = { details: null };
        const details = { name: "test-name", lat: 1, lng: 2 };

        mutations.view(state, details);

        expect(state.details).toEqual(details);
      });
    });
  });

  describe("getters", () => {
    describe("getResolvedById", () => {
      it("should retrieve the correct resolved address if it's saved into the state", () => {
        const resolved = { id: "test-id", value: {} };
        const state = { resolved: [resolved] };

        const result = getters.getResolvedById(state)(resolved.id);

        expect(result).toEqual(resolved);
      });

      it("should return null if the requested id was not saved into the state", () => {
        const resolved = { id: "test-id", coordinates: {} };
        const state = { resolved: [resolved] };

        const result = getters.getResolvedById(state)("other-id");

        expect(result).toBeUndefined();
      });
    });

    describe("getLocationTypeByValue", () => {
      it("should retrieve the type stored in the state by value passed", () => {
        const type = { value: "test-value", icon: "" };
        const state = { types: [type] };

        const result = getters.getLocationTypeByValue(state)(type.value);

        expect(result).toEqual(type);
      });

      it("should return undefined if the requested id was not saved into the state", () => {
        const type = { value: "test-value", icon: "" };
        const state = { types: [type] };

        const result = getters.getLocationTypeByValue(state)("other-id");

        expect(result).toBeUndefined();
      });
    });

    describe("getLocationTypeById", () => {
      it("should retrieve the type stored in the state by id passed", () => {
        const type = { id: "test-id", icon: "" };
        const state = { types: [type] };

        const result = getters.getLocationTypeById(state)(type.id);

        expect(result).toEqual(type);
      });

      it("should return undefined if the requested id was not saved into the state", () => {
        const type = { id: "test-id", icon: "" };
        const state = { types: [type] };

        const result = getters.getLocationTypeById(state)("other-id");

        expect(result).toBeUndefined();
      });
    });
  });

  describe("actions", () => {
    const context = {
      dispatch: jest.fn(),
      commit: jest.fn(),
      getters: {
        getResolvedById: jest.fn(),
        getLocationTypeById: jest.fn()
      }
    };

    beforeEach(() => {
      jest.resetAllMocks();
    });

    describe("searchByAddress", () => {
      it("should call http with the correct url and request object", () => {
        const query = "testQuery";
        const expectedRequestObject = { method: "GET" };
        actions.searchByAddress(context, query);

        expect(http).toHaveBeenCalledTimes(1);

        expect(http.mock.calls[0][0].searchParams.get("q")).toEqual(query);
        expect(http.mock.calls[0][1]).toEqual(expectedRequestObject);
      });

      it("should return a populated suggestion list provided a valid http call response ", async () => {
        const query = "test-query";

        http.mockResolvedValue({
          response: {
            docs: [
              { id: "test-id", weergavenaam: "test address" },
              { id: "test-id1", weergavenaam: "test address1" },
              { id: "test-id2", weergavenaam: "test address2" }
            ]
          }
        });

        const expectedResult = [
          { id: "test-id", label: "test address" },
          { id: "test-id1", label: "test address1" },
          { id: "test-id2", label: "test address2" }
        ];

        const result = await actions.searchByAddress(context, query);

        expect(result).toEqual(expectedResult);
      });

      it("should return an empty suggestion list and dispatch an error on a failed http call", async () => {
        const query = "test-query";

        http.mockRejectedValue(new Error());

        const result = await actions.searchByAddress(context, query);

        expect(result).toEqual([]);
        expect(context.dispatch).toBeCalledTimes(1);
        expect(context.dispatch.mock.calls[0][0]).toBe("reportError");
        expect(context.dispatch.mock.calls[0][1]).toBeInstanceOf(Error);
        expect(context.dispatch.mock.calls[0][2]).toEqual({ root: true });
      });
    });

    describe("resolve", () => {
      it("should return the already resolved address if present in its state", async () => {
        const testId = "test-id";
        const resolved = { id: testId, value: "test value", coordinates: { lat: 1, lng: 2 } };

        context.getters.getResolvedById.mockReturnValue(resolved);

        const result = await actions.resolve(context, testId);

        expect(result).toEqual(resolved);
      });

      it("should call http with the correct request object if no resolved value is found in state", () => {
        const testId = "test-id";
        const expectedRequestObject = { method: "GET" };

        actions.resolve(context, testId);

        expect(http).toHaveBeenCalledTimes(1);

        expect(http.mock.calls[0][0].searchParams.get("id")).toEqual(testId);
        expect(http.mock.calls[0][1]).toEqual(expectedRequestObject);
      });

      it("should return an empty resolve value and dispatch an error on a failed http call", async () => {
        const testId = "test-id";
        const expectedResult = { id: undefined, label: "", value: null };

        http.mockRejectedValue(new Error());

        const result = await actions.resolve(context, testId);

        expect(result).toEqual(expectedResult);
        expect(context.dispatch).toBeCalledTimes(1);
        expect(context.dispatch.mock.calls[0][0]).toBe("reportError");
        expect(context.dispatch.mock.calls[0][1]).toBeInstanceOf(Error);
        expect(context.dispatch.mock.calls[0][2]).toEqual({ root: true });
      });

      it("should return a resolved value and commit it to the state on a successful http call", async () => {
        const testId = "test-id";
        const address = "test-address";
        const expectedResult = {
          id: testId,
          label: address,
          value: { lat: 51.31204224, lng: 3.94129736 }
        };

        http.mockResolvedValue({
          response: {
            docs: [
              {
                weergavenaam: address,
                centroide_ll: "POINT(3.94129736 51.31204224)"
              }
            ]
          }
        });

        const result = await actions.resolve(context, testId);

        expect(result).toEqual(expectedResult);
        expect(context.commit).toBeCalledTimes(1);
        expect(context.commit).toHaveBeenCalledWith("saveResolved", expectedResult);
      });
    });

    describe("fetch", () => {
      it("should commit an empty poi array and not call http whenever passed an empty filters array", () => {
        const filters = [];
        const areas = [
          {
            rangeId: "union",
            paths: []
          }
        ];
        actions.fetch(context, { filters, areas });

        expect(http).not.toHaveBeenCalled();
        expect(context.commit).toHaveBeenCalledWith("updatePois", []);
      });

      it("should commit an empty poi array and not call http whenever passed an empty areas array", () => {
        const filters = [{ value: "test" }];
        const areas = [];
        actions.fetch(context, { filters, areas });

        expect(http).not.toHaveBeenCalled();
        expect(context.commit).toHaveBeenCalledWith("updatePois", []);
      });

      it("should call http with the correct request object whenever passed the right parameters", () => {
        const filters = [{ value: "test" }];
        const areas = [
          {
            rangeId: "union",
            paths: [[{ lat: 1, lng: 2 }, { lat: 1, lng: 2 }, { lat: 1, lng: 2 }]]
          }
        ];
        actions.fetch(context, { filters, areas });

        expect(http).toHaveBeenCalledTimes(1);
        expect(http.mock.calls[0][1]).toEqual({
          body: JSON.stringify({
            poi_by_type: ["test"],
            poi_in_polygon: {
              type: "Feature",
              geometry: {
                type: "Polygon",
                coordinates: [[[2, 1], [2, 1], [2, 1]]],
                crs: { type: "name", properties: { name: "EPSG:4326" } }
              }
            }
          }),
          headers: {
            Accept: "application/json",
            "Content-type": "application/json; charset=utf-8"
          },
          method: "POST"
        });
      });

      it("should commit a populated poi array whenever the http call returns a valid json", async () => {
        const filters = [{ value: "test" }];
        const areas = [
          {
            rangeId: "union",
            paths: [[{ lat: 1, lng: 2 }, { lat: 1, lng: 2 }, { lat: 1, lng: 2 }]]
          }
        ];
        const expectedResult = { name: "test" };

        http.mockResolvedValue([[expectedResult]]);

        await actions.fetch(context, { filters, areas });

        expect(context.commit).toHaveBeenCalledWith("updatePois", [expectedResult]);
      });

      it("should commit a populated poi array whenever the http call returns an empty json", async () => {
        const filters = [{ value: "test" }];
        const areas = [
          {
            rangeId: "union",
            paths: [[{ lat: 1, lng: 2 }, { lat: 1, lng: 2 }, { lat: 1, lng: 2 }]]
          }
        ];

        http.mockResolvedValue({});

        await actions.fetch(context, { filters, areas });

        expect(context.commit).toHaveBeenCalledWith("updatePois", []);
      });

      it("should commit an empty poi array and call dispatch an error whenever the http call fails", async () => {
        const filters = [{ value: "test" }];
        const areas = [
          {
            rangeId: "union",
            paths: [[{ lat: 1, lng: 2 }, { lat: 1, lng: 2 }, { lat: 1, lng: 2 }]]
          }
        ];
        http.mockRejectedValue(new Error());

        await actions.fetch(context, { filters, areas });

        expect(context.commit).toHaveBeenCalledTimes(1);
        expect(context.commit).toHaveBeenCalledWith("updatePois", []);
        expect(context.dispatch).toHaveBeenCalledTimes(1);
        expect(context.dispatch.mock.calls[0][0]).toBe("reportError");
        expect(context.dispatch.mock.calls[0][1]).toBeInstanceOf(Error);
        expect(context.dispatch.mock.calls[0][2]).toEqual({ root: true });
      });
    });

    describe("lookup", () => {
      it("should call http with the correct url and request object", () => {
        const name = "test name";
        const expectedRequestObject = {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-type": "application/json; charset=utf-8"
          },
          body: '{"poi_by_name":"test name"}'
        };
        actions.lookup(context, name);

        expect(http).toHaveBeenCalledTimes(1);

        expect(http.mock.calls[0][1]).toEqual(expectedRequestObject);
      });

      it("should commit a details object provided a valid http call response ", async () => {
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

        context.getters.getLocationTypeById.mockReturnValue({ icon });

        http.mockResolvedValue([[response]]);

        const location = {
          name: response.name,
          description: response.description,
          address: `${response.street}, ${response.postalcode} ${response.city}`,
          website: response.website,
          phone: response.phone,
          lng: response.geo_location.coordinates[0],
          lat: response.geo_location.coordinates[1],
          icon
        };

        await actions.lookup(context, name);

        expect(context.commit).toHaveBeenCalledTimes(1);
        expect(context.commit).toHaveBeenCalledWith("view", location);
      });

      it("should commit a null details object provided an empty http call response ", async () => {
        const name = "test-query";

        http.mockResolvedValue({});

        await actions.lookup(context, name);

        expect(context.commit).toHaveBeenCalledTimes(1);
        expect(context.commit).toHaveBeenCalledWith("view", null);
      });

      it("should commit a null details object and dispatch an error on a failed http call", async () => {
        const query = "test-query";

        http.mockRejectedValue(new Error());

        await actions.lookup(context, query);

        expect(context.commit).toHaveBeenCalledTimes(1);
        expect(context.commit).toHaveBeenCalledWith("view", null);
        expect(context.dispatch).toBeCalledTimes(1);
        expect(context.dispatch.mock.calls[0][0]).toBe("reportError");
        expect(context.dispatch.mock.calls[0][1]).toBeInstanceOf(Error);
        expect(context.dispatch.mock.calls[0][2]).toEqual({ root: true });
      });
    });
  });
});
