import Vuex from "vuex";
import { shallowMount, createLocalVue } from "@vue/test-utils";

import App from "@/App.vue";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("App", () => {
  let store;
  let wrapper;
  let rangesWithOriginStub = [
    { rangeId: "range-0", originType: "home" },
    { rangeId: "range-1", originType: "work" }
  ];
  let fetchAreasSpy = jest.fn();
  let fetchPoisSpy = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    store = new Vuex.Store({
      modules: {
        ranges: {
          namespaced: true,
          state: {
            ranges: [...rangesWithOriginStub]
          },
          mutations: {
            updateRanges: (state, ranges) => {
              state.ranges = ranges;
            }
          },
          getters: {
            rangesWithOrigin: state => state.ranges
          }
        },
        areas: {
          namespaced: true,
          mutations: {
            updateAreas: (state, areas) => {
              state.areas = areas;
            }
          },
          actions: {
            fetch: fetchAreasSpy
          },
          state: {
            areas: [{ rangeId: "test" }]
          }
        },
        filters: {
          namespaced: true,
          mutations: {
            updateFilters: (state, filters) => {
              state.filters = filters;
            }
          },
          state: {
            filters: [{ value: "test" }]
          }
        },
        locations: {
          namespaced: true,
          actions: {
            fetch: fetchPoisSpy
          }
        }
      }
    });

    wrapper = shallowMount(App, {
      localVue,
      store,
      stubs: ["app-header", "app-tabs", "app-map", "router-view"]
    });
  });

  it("should create", () => {
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it("should trigger an areas refresh whenever the rangesWithOrigin prop changes with relevant properties", () => {
    store.commit("ranges/updateRanges", rangesWithOriginStub.slice(1, 0));

    expect(fetchAreasSpy).toHaveBeenCalled();
  });

  it("should not trigger an areas refresh whenever the rangesWithOrigin prop changes with irelevant properties", () => {
    const rangesWithOriginNewValue = [...rangesWithOriginStub];
    rangesWithOriginNewValue[0].originType = "gym";

    store.commit("ranges/updateRanges", rangesWithOriginNewValue);

    expect(fetchAreasSpy).not.toHaveBeenCalled();
  });

  it("should trigger a poi refresh whenever the filters prop changes", () => {
    store.commit("filters/updateFilters", []);

    expect(fetchPoisSpy).toHaveBeenCalled();
  });

  it("should trigger a poi refresh whenever the areas prop changes", () => {
    const rangesWithOriginNewValue = [...rangesWithOriginStub];
    rangesWithOriginNewValue[0].originType = "gym";

    store.commit("areas/updateAreas", []);

    expect(fetchAreasSpy).not.toHaveBeenCalled();
  });
});
