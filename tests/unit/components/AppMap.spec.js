import { shallowMount, createLocalVue } from "@vue/test-utils";

import AppMap from "@/components/AppMap.vue";

const localVue = createLocalVue();

describe("AppMap", () => {
  it("should create", () => {
    const wrapper = shallowMount(AppMap, {
      localVue
    });

    expect(wrapper.isVueInstance()).toBeTruthy();
  });
});
