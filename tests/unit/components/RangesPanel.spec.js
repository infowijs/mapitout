import { shallowMount, createLocalVue } from "@vue/test-utils";

import RangesPanel from "@/components/RangesPanel.vue";

const localVue = createLocalVue();

describe("RangesPanel", () => {
  it("should create", () => {
    const wrapper = shallowMount(RangesPanel, {
      localVue,
      stubs: ["router-view"]
    });

    expect(wrapper.isVueInstance()).toBeTruthy();
  });
});
