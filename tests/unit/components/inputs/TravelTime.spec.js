import { shallowMount, createLocalVue } from "@vue/test-utils";

import TravelTime from "@/components/input/TravelTime.vue";

const localVue = createLocalVue();

describe("TravelTime", () => {
  it("should create", () => {
    const wrapper = shallowMount(TravelTime, {
      localVue
    });

    expect(wrapper.isVueInstance()).toBeTruthy();
  });
});
