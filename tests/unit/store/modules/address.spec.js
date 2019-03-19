import { mutations, getters, actions } from "../../../../src/store/modules/address";

describe("address store module", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

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
  });

  describe("getters", () => {
    describe("getResolvedById", () => {
      it("should retrieve the correct resolved address if it's saved into the state", () => {
        const resolved = { id: "test-id", coordinates: {} };
        const state = { resolved: [resolved] };

        const result = getters.getResolvedById(state, resolved.id);

        expect(result).toEqual(resolved);
      });

      it("should return null if the requested id was not saved into the state", () => {
        const resolved = { id: "test-id", coordinates: {} };
        const resolved2 = { id: "test-id2", coordinates: {} };
        const state = { resolved: [resolved] };

        const result = getters.getResolvedById(state, resolved2.id);

        expect(result).toBeUndefined();
      });
    });
  });

  describe("actions", () => {
    describe("search", () => {
      it("should call fetch with the correct url and request object", () => {
        const query = "testQuery";
        const expectedRequestObject = { method: "GET" };
        actions.search({ dispatch: jest.fn() }, query);

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch.mock.calls[0][1]).toEqual(expectedRequestObject);

        const requestUrl = fetch.mock.calls[0][0];

        expect(requestUrl.searchParams.get("q")).toEqual(query);
      });

      it("should return an empty array and dispatch an error action on a failed fetch call", async () => {
        const dispatch = jest.fn();
        const query = "test-query";

        fetch.mockResolvedValue({ ok: false });

        const result = await actions.search({ dispatch }, query);

        expect(dispatch).toHaveBeenCalledWith("reportError", new Error("Server error"), {
          root: true
        });
        expect(result).toEqual([]);
      });

      it("should return a suggestion array given valid json", async () => {
        const dispatch = jest.fn();
        const query = "test-query";
        const validServerResponse = {
          response: {
            docs: [
              { id: "test-id", weergavenaam: "test address" },
              { id: "test-id1", weergavenaam: "test address1" },
              { id: "test-id2", weergavenaam: "test address2" }
            ]
          }
        };
        const expectedResult = [
          { id: "test-id", address: "test address" },
          { id: "test-id1", address: "test address1" },
          { id: "test-id2", address: "test address2" }
        ];

        fetch.mockResolvedValue({
          ok: true,
          json: jest.fn().mockResolvedValue(validServerResponse)
        });

        const result = await actions.search({ dispatch }, query);

        expect(result).toEqual(expectedResult);
      });

      it("should return an empty array and dispatch an error action given invalid json", async () => {
        const dispatch = jest.fn();
        const query = "test-query";

        fetch.mockResolvedValue({ ok: true, json: jest.fn().mockRejectedValue("invalid json") });

        const result = await actions.search({ dispatch }, query);

        expect(dispatch).toHaveBeenCalledWith("reportError", new Error("Invalid response format"), {
          root: true
        });
        expect(result).toEqual([]);
      });
    });

    describe("resolve", () => {
      let context;

      beforeEach(() => {
        context = {
          dispatch: jest.fn(),
          commit: jest.fn(),
          getters: { getResolvedById: jest.fn() }
        };
      });

      it("should return the already resolved address if present in its state", async () => {
        const testId = "test-id";
        const resolved = { coordinates: { lat: 1, lng: 2 } };

        context.getters.getResolvedById.mockReturnValue(resolved);

        const result = await actions.resolve(context, testId);

        expect(result).toEqual(resolved.coordinates);
      });

      it("should call fetch with the correct request object if no resolved value is found", () => {
        const testId = "test-id";
        const expectedRequestObject = { method: "GET" };

        actions.resolve(context, testId);

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch.mock.calls[0][1]).toEqual(expectedRequestObject);

        const requestUrl = fetch.mock.calls[0][0];

        expect(requestUrl.searchParams.get("id")).toEqual(testId);
      });

      it("should return a null value and dispatch an error action on a failed fetch call", async () => {
        const testId = "test-id";

        fetch.mockResolvedValue({ ok: false });

        const result = await actions.resolve(context, testId);

        expect(context.dispatch).toHaveBeenCalledWith("reportError", new Error("Server error"), {
          root: true
        });
        expect(result).toBeNull();
      });

      it("should return a null value and dispatch an error action given invalid json", async () => {
        const testId = "test-id";

        fetch.mockResolvedValue({ ok: true, json: jest.fn().mockRejectedValue("invalid json") });

        const result = await actions.resolve(context, testId);

        expect(context.dispatch).toHaveBeenCalledWith(
          "reportError",
          new Error("Invalid response format"),
          {
            root: true
          }
        );
        expect(result).toBeNull();
      });

      it("return a coordinates object that will be saved to state on a successful fetch call", async () => {
        const testId = "test-id";
        const validServerResponse = {
          response: {
            docs: [{ centroide_ll: "POINT(3.94129736 51.31204224)" }]
          }
        };
        const expectedResult = { lat: 51.31204224, lng: 3.94129736 };

        fetch.mockResolvedValue({
          ok: true,
          json: jest.fn().mockResolvedValue(validServerResponse)
        });

        const result = await actions.resolve(context, testId);

        expect(result).toEqual(expectedResult);
        expect(context.commit).toHaveBeenCalledWith("saveResolved", {
          id: testId,
          coordinates: result
        });
      });
    });
  });
});
