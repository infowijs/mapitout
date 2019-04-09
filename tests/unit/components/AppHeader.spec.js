import { shallowMount, createLocalVue } from "@vue/test-utils";

import AppHeader from "@/components/AppHeader.vue";

const localVue = createLocalVue();

describe("AppHeader", () => {
  it("should create", () => {
    const wrapper = shallowMount(AppHeader, {
      stubs: ["router-link"],
      localVue
    });

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it("should emit an input event whenever clicking the filters toggle", () => {
    const wrapper = shallowMount(AppHeader, {
      stubs: ["router-link"],
      localVue
    });

    wrapper.find(".filters-toggle").trigger("click");

    expect(wrapper.emitted("input")).toBeTruthy();
  });
});
