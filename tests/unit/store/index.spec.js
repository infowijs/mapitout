import store from "../../../src/store";
import flushPromises from "flush-promises";

describe("root store", () => {
  const dispatchSpy = jest.spyOn(store, "dispatch").mockImplementation();
  const state = {
    error: "",
    route: {
      query: {}
    },
    filters: {
      filters: ["not empty"]
    },
    ranges: {
      ranges: []
    },
    areas: {
      areas: []
    }
  };

  beforeEach(async () => {
    store.replaceState({ ...state });

    await flushPromises();

    jest.resetAllMocks();
  });

  it("should watch for mutations in the route module, query r state and replace ranges based on it if different to those in state", async () => {
    store.replaceState({
      ...state,
      route: {
        query: {
          r:
            "0%5Bid%5D=0&0%5BotId%5D=0&0%5BoId%5D=adr-9f66242f9c71df70f6920f7f45039b8b&0%5Bo%5D=Oosterdokskade%2035%2C%201011DL%20Amsterdam&0%5BttId%5D=0&0%5Btt%5D=45&0%5Bt%5D=1555315412729"
        }
      }
    });

    await flushPromises();

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith("ranges/replace", [
      {
        id: 0,
        originTypeId: 0,
        originId: "adr-9f66242f9c71df70f6920f7f45039b8b",
        origin: "Oosterdokskade 35, 1011DL Amsterdam",
        transportTypeId: 0,
        travelTime: 45,
        departureTime: "2019-04-15T08:03:32.729Z"
      }
    ]);
  });

  it("should watch for mutations in the route module, query r state and avoid replacing ranges based on it if identical to those in state", async () => {
    store.replaceState({
      ...state,
      ranges: {
        ranges: [
          {
            id: 0,
            originTypeId: 0,
            originId: "adr-9f66242f9c71df70f6920f7f45039b8b",
            origin: "Oosterdokskade 35, 1011DL Amsterdam",
            transportTypeId: 0,
            travelTime: 45,
            departureTime: "2019-04-15T08:03:32.729Z"
          }
        ]
      }
    });

    await flushPromises();

    dispatchSpy.mockReset();

    store.replaceState({
      ...state,
      ranges: {
        ranges: [
          {
            id: 0,
            originTypeId: 0,
            originId: "adr-9f66242f9c71df70f6920f7f45039b8b",
            origin: "Oosterdokskade 35, 1011DL Amsterdam",
            transportTypeId: 0,
            travelTime: 45,
            departureTime: "2019-04-15T08:03:32.729Z"
          }
        ]
      },
      route: {
        query: {
          r:
            "0%5Bid%5D=0&0%5BotId%5D=0&0%5BoId%5D=adr-9f66242f9c71df70f6920f7f45039b8b&0%5Bo%5D=Oosterdokskade%2035%2C%201011DL%20Amsterdam&0%5BttId%5D=0&0%5Btt%5D=45&0%5Bt%5D=1555315412729"
        }
      }
    });

    await flushPromises();

    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it("should watch for mutations in the route module, query f state and replace filters based on it if different to those in state", async () => {
    store.replaceState({
      ...state,
      route: {
        query: {
          f: "0=2"
        }
      }
    });

    await flushPromises();

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith("filters/select", [2]);
  });

  it("should watch for mutations in the route module, query f state and avoid replacing filters based on it if identical to those in state", async () => {
    store.replaceState({
      ...state,
      filters: {
        filters: [
          {
            id: 2,
            selected: true
          }
        ]
      }
    });

    await flushPromises();

    dispatchSpy.mockReset();

    store.replaceState({
      ...state,
      filters: {
        filters: [
          {
            id: 2,
            selected: true
          }
        ]
      },
      route: {
        query: {
          f: "0=2"
        }
      }
    });

    await flushPromises();

    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it("should watch for mutations in the ranges module, ranges state and dispatch an area/fetch action only on change", async () => {
    store.replaceState({
      ...state,
      ranges: {
        ranges: [{ id: 1 }]
      }
    });

    await flushPromises();

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith("areas/fetch");

    dispatchSpy.mockReset();

    store.replaceState({
      ...state,
      ranges: {
        ranges: [{ id: 1 }]
      }
    });

    await flushPromises();

    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it("should watch for mutations in the areas module, areas state and dispatch a locations/fetch action only on change", async () => {
    store.replaceState({
      ...state,
      areas: {
        areas: [{ id: 1 }]
      }
    });

    await flushPromises();

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith("pois/fetch");

    dispatchSpy.mockReset();

    store.replaceState({
      ...state,
      areas: {
        areas: [{ id: 1 }]
      }
    });

    await flushPromises();

    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it("should watch for mutations in the filters module, filters state and dispatch an locations/fetch action only on change", async () => {
    store.replaceState({
      ...state,
      filters: {
        filters: [{ id: 1 }]
      }
    });

    await flushPromises();

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith("pois/fetch");

    dispatchSpy.mockReset();

    store.replaceState({
      ...state,
      filters: {
        filters: [{ id: 1 }]
      }
    });

    await flushPromises();

    expect(dispatchSpy).not.toHaveBeenCalled();
  });
});
