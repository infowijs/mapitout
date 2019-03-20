import { shallowMount, createLocalVue } from "@vue/test-utils";

import TransportType from "@/components/input/TransportType.vue";

const localVue = createLocalVue();

describe("TransportType", () => {
  it("should create", () => {
    const wrapper = shallowMount(TransportType, {
      localVue
    });

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it("should change its value upon clicking an option", () => {
    const wrapper = shallowMount(TransportType, {
      localVue
    });

    wrapper.find("li button").trigger("click");

    expect(wrapper.emitted("input")).toBeTruthy();
  });
});
