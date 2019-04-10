import Vuex from "vuex";
import { shallowMount, createLocalVue } from "@vue/test-utils";

import App from "@/App.vue";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("App", () => {
  let wrapper;

  beforeEach(() => {
    jest.resetAllMocks();

    wrapper = shallowMount(App, {
      localVue,
      stubs: ["app-header", "app-tabs", "app-map", "router-view"]
    });
  });

  it("should create", () => {
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
});
