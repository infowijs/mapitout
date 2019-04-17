import { mutations, getters, actions } from "../../../../src/store/modules/origins";
import { http } from "../../../../src/utils";

jest.mock("../../../../src/utils", () => {
  return {
    http: jest.fn()
  };
});

describe("origins store module", () => {
  describe("getters", () => {
    describe("getOriginById", () => {
      const state = {
        origins: [{ id: "test" }]
      };

      it("should retrieve the correct resolved address if it's saved into the state", () => {
        const result = getters.getOriginById(state)("test");

        expect(result).toEqual(state.origins[0]);
      });

      it("should return undefined if the requested id was not saved into the state", () => {
        const result = getters.getOriginById(state)("other-id");

        expect(result).toBeUndefined();
      });
    });

    describe("getOriginIconByOriginTypeId", () => {
      const state = {
        types: [{ id: "test", icon: "icon" }]
      };

      it("should return the icon of the origin type stored in the state by passed type id", () => {
        const result = getters.getOriginIconByOriginTypeId(state)("test");

        expect(result).toEqual(state.types[0].icon);
      });

      it("should return undefined if the requested id was not saved into the state", () => {
        const result = getters.getOriginIconByOriginTypeId(state)("other-id");

        expect(result).toBeUndefined();
      });
    });

    describe("getOriginIconComponentByOriginTypeId", () => {
      const state = {
        types: [{ id: "test", iconComponent: "icon" }]
      };

      it("should return the icon of the origin type stored in the state by passed type id", () => {
        const result = getters.getOriginIconComponentByOriginTypeId(state)("test");

        expect(result).toEqual(state.types[0].iconComponent);
      });

      it("should return undefined if the requested id was not saved into the state", () => {
        const result = getters.getOriginIconComponentByOriginTypeId(state)("other-id");

        expect(result).toBeUndefined();
      });
    });

    describe("getOriginHighlightColorByOriginTypeId", () => {
      const state = {
        types: [{ id: "test", highlightColor: "#color" }]
      };

      it("should return the highlight color of the origin type stored in the state by passed type id", () => {
        const result = getters.getOriginHighlightColorByOriginTypeId(state)("test");

        expect(result).toEqual(state.types[0].highlightColor);
      });

      it("should return undefined if the requested id was not saved into the state", () => {
        const result = getters.getOriginHighlightColorByOriginTypeId(state)("other-id");

        expect(result).toBeUndefined();
      });
    });
  });

  describe("mutations", () => {
    describe("saveResolved", () => {
      const origin = { id: "test" };

      it("should add the resolved address to state", () => {
        const state = { origins: [] };

        mutations.save(state, origin);

        expect(state.origins.length).toBe(1);
        expect(state.origins.includes(origin)).toBeTruthy();
      });

      it("should skip adding and already resolved address to state", () => {
        const state = { origins: [origin] };

        mutations.save(state, origin);

        expect(state.origins.length).toBe(1);
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
      }
    };

    beforeEach(() => {
      jest.resetAllMocks();
    });

    describe("lookup", () => {
      it("should call http with the correct url and request object", () => {
        const query = "testQuery";
        const expectedRequestObject = { method: "GET" };
        actions.lookup(context, query);

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
          { id: "test-id", address: "test address" },
          { id: "test-id1", address: "test address1" },
          { id: "test-id2", address: "test address2" }
        ];

        const result = await actions.lookup(context, query);

        expect(result).toEqual(expectedResult);
      });

      it("should return an empty suggestion list and dispatch an error on a failed http call", async () => {
        const query = "test-query";

        http.mockRejectedValue(new Error());

        const result = await actions.lookup(context, query);

        expect(result).toEqual([]);
        expect(context.dispatch).toBeCalledTimes(1);
        expect(context.dispatch.mock.calls[0][0]).toBe("errors/network");
        expect(context.dispatch.mock.calls[0][1]).toBeInstanceOf(Error);
        expect(context.dispatch.mock.calls[0][2]).toEqual({ root: true });
      });
    });

    describe("resolve", () => {
      it("should return the already resolved address if present in its state", async () => {
        const testId = "test-id";
        const origin = { id: testId, address: "test value", lat: 1, lng: 2 };

        context.getters.getOriginById.mockReturnValue(origin);

        const result = await actions.resolve(context, testId);

        expect(result).toEqual(origin);
      });

      it("should call http with the correct request object if no resolved value is found in state", () => {
        const testId = "test-id";
        const expectedRequestObject = { method: "GET" };

        actions.resolve(context, testId);

        expect(http).toHaveBeenCalledTimes(1);

        expect(http.mock.calls[0][0].searchParams.get("id")).toEqual(testId);
        expect(http.mock.calls[0][1]).toEqual(expectedRequestObject);
      });

      it("should return null and dispatch an error on a failed http call", async () => {
        const testId = "test-id";
        const expectedResult = null;

        http.mockRejectedValue(new Error());

        const result = await actions.resolve(context, testId);

        expect(result).toEqual(expectedResult);
        expect(context.dispatch).toBeCalledTimes(1);
        expect(context.dispatch.mock.calls[0][0]).toBe("errors/network");
        expect(context.dispatch.mock.calls[0][1]).toBeInstanceOf(Error);
        expect(context.dispatch.mock.calls[0][2]).toEqual({ root: true });
      });

      it("should return a resolved value and commit it to the state on a successful http call", async () => {
        const testId = "test-id";
        const address = "test-address";
        const expectedResult = {
          id: testId,
          address: address,
          lat: 51.31204224,
          lng: 3.94129736
        };

        http.mockResolvedValue({
          response: {
            docs: [
              {
                weergavenaam: address,
                centroide_ll: `POINT(${expectedResult.lng} ${expectedResult.lat})`
              }
            ]
          }
        });

        const result = await actions.resolve(context, testId);

        expect(result).toEqual(expectedResult);
        expect(context.commit).toBeCalledTimes(1);
        expect(context.commit).toHaveBeenCalledWith("save", expectedResult);
      });
    });

    describe("resolveArray", () => {
      it("should dispatch resolve actions for all ids passed as a parameter", async () => {
        const ids = ["test-id-1", "test-id-2"];

        await actions.resolveArray(context, ids);

        expect(context.dispatch).toBeCalledTimes(2);
        expect(context.dispatch.mock.calls[0]).toEqual(["resolve", ids[0]]);
        expect(context.dispatch.mock.calls[1]).toEqual(["resolve", ids[1]]);
      });

      it("should dispatch resolve actions for all ids passed as a parameter", async () => {
        const ids = ["test-id-1", "test-id-2"];

        await actions.resolveArray(context, ids);

        expect(context.dispatch).toBeCalledTimes(2);
        expect(context.dispatch.mock.calls[0]).toEqual(["resolve", ids[0]]);
        expect(context.dispatch.mock.calls[1]).toEqual(["resolve", ids[1]]);
      });

      it("should return the origins array if all origins were resolved", async () => {
        const ids = ["test-id"];
        const origin = { id: "test-id" };

        context.dispatch.mockResolvedValue(origin);
        const result = await actions.resolveArray(context, ids);

        expect(result).toEqual([origin]);
      });

      it("should return an empty origins array if none or only some of the origins were resolved", async () => {
        const ids = ["test-id"];
        const origin = undefined;

        context.dispatch.mockResolvedValue(origin);
        const result = await actions.resolveArray(context, ids);

        expect(result).toEqual([]);
      });
    });
  });
});
