import { shallowMount, createLocalVue } from "@vue/test-utils";

import Range from "@/components/Range.vue";

const localVue = createLocalVue();

describe("Range", () => {
  it("should create", () => {
    const wrapper = shallowMount(Range, {
      localVue
    });

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it("should emit an input event whenever the origin property changes", () => {
    const wrapper = shallowMount(Range, {
      localVue,
      data() {
        return {
          origin: {
            type: "home",
            addressId: "initial",
            address: "initial",
            coordinates: { lat: 0, lng: 0 }
          }
        };
      }
    });

    wrapper.vm.origin = {
      type: "gym",
      addressId: "different",
      address: "different",
      coordinates: { lat: 1, lng: 2 }
    };

    expect(wrapper.emitted("input")).toBeTruthy();
  });

  it("should emit an input event whenever the travelTime property changes", () => {
    const wrapper = shallowMount(Range, {
      localVue
    });

    wrapper.setData({ travelTime: 10 });

    expect(wrapper.emitted("input")).toBeTruthy();
  });

  it("should emit an input event whenever the transportType property changes", () => {
    const wrapper = shallowMount(Range, {
      localVue
    });

    wrapper.setData({ transportType: "driving" });

    expect(wrapper.emitted("input")).toBeTruthy();
  });
});
