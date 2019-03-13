import { shallowMount, createLocalVue } from "@vue/test-utils";

import LocationAddress from "@/components/LocationAddress.vue";

const localVue = createLocalVue();

describe("LocationAddress", () => {
  it("should create", () => {
    const wrapper = shallowMount(LocationAddress, {
      localVue
    });

    expect(wrapper.isVueInstance()).toBeTruthy();
  });
});
