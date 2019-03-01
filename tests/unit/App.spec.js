import { shallowMount, createLocalVue } from "@vue/test-utils";

import App from "@/App.vue";

const localVue = createLocalVue();

describe("App", () => {
  it("should create", () => {
    const wrapper = shallowMount(App, {
      localVue,
      stubs: ["app-header", "app-tabs", "app-map"]
    });

    expect(wrapper.isVueInstance()).toBeTruthy();
  });
});
