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
});
