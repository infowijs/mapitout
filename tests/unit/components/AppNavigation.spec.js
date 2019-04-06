import { shallowMount, createLocalVue } from "@vue/test-utils";

import AppNavigation from "@/components/AppNavigation.vue";

const localVue = createLocalVue();

describe("AppNavigation", () => {
  it("should create", () => {
    const wrapper = shallowMount(AppNavigation, {
      localVue,
      stubs: ["router-link"]
    });

    expect(wrapper.isVueInstance()).toBeTruthy();
  });
});
