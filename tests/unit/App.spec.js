import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";

import App from "@/App.vue";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("App", () => {
  let wrapper;

  beforeEach(() => {
    jest.resetAllMocks();

    wrapper = shallowMount(App, {
      localVue,
      stubs: ["app-header", "app-tabs", "app-map", "router-view"],
      mocks: {
        $route: jest.fn()
      }
    });
  });

  it("should create", () => {
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it("should contain a value to toggle filters with", () => {
    expect(wrapper.vm).toHaveProperty("showFilters", false);
  });
});
