import { shallowMount, createLocalVue } from "@vue/test-utils";

import FilterPanel from "@/components/FilterPanel.vue";

const localVue = createLocalVue();

describe("FilterPanel", () => {
  it("should create", () => {
    const wrapper = shallowMount(FilterPanel, {
      localVue
    });

    expect(wrapper.isVueInstance()).toBeTruthy();
  });
});
