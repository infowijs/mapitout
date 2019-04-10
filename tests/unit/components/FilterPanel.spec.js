import { shallowMount, createLocalVue } from "@vue/test-utils";

import FiltersPanel from "@/components/FiltersPanel.vue";

const localVue = createLocalVue();

xdescribe("FiltersPanel", () => {
  it("should create", () => {
    const wrapper = shallowMount(FiltersPanel, {
      localVue
    });

    expect(wrapper.isVueInstance()).toBeTruthy();
  });
});
