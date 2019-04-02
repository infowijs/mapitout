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
          actions: {
            fetch: fetchAreasSpy
          }
        }
      }
    });

    wrapper = shallowMount(App, {
      localVue,
      store,
      stubs: ["app-header", "app-tabs", "app-map"]
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
});
