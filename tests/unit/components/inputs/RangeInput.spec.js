import { shallowMount, createLocalVue } from "@vue/test-utils";

import RangeInput from "@/components/input/RangeInput.vue";

const localVue = createLocalVue();

describe("RangeInput", () => {
  it("should create", () => {
    const wrapper = shallowMount(RangeInput, {
      localVue
    });

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it("should emit a focus event whenever clicked", () => {
    const wrapper = shallowMount(RangeInput, {
      localVue
    });

    wrapper.trigger("click");

    expect(wrapper.emitted("focus")).toBeTruthy();
  });

  // todo this test does not work ofr unknown reasons. It seems that calling setData with a object property does not trigger the watch in tests
  xit("should emit an input event whenever the location property changes", () => {
    const wrapper = shallowMount(RangeInput, {
      localVue
    });

    wrapper.setData({
      location: {}
    });

    expect(wrapper.emitted("input")).toBeTruthy();
  });

  it("should emit an input event whenever the travelTime property changes", () => {
    const wrapper = shallowMount(RangeInput, {
      localVue
    });

    wrapper.setData({ travelTime: 10 });

    expect(wrapper.emitted("input")).toBeTruthy();
  });

  it("should emit an input event whenever the transportType property changes", () => {
    const wrapper = shallowMount(RangeInput, {
      localVue
    });

    wrapper.setData({ transportType: "bicycle" });

    expect(wrapper.emitted("input")).toBeTruthy();
  });
});
