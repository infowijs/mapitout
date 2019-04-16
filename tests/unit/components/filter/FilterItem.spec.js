import { shallowMount, createLocalVue } from "@vue/test-utils";

import FilterItem from "@/components/filter/FilterItem.vue";

const localVue = createLocalVue();

describe("FilterItem", () => {
  const value = {
    value: "test",
    icon: "icon-bus",
    selected: false
  };

  it("should create", () => {
    const wrapper = shallowMount(FilterItem, {
      localVue,
      propsData: {
        value
      }
    });

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it("should emit a click event on any wrapper clicks", () => {
    const wrapper = shallowMount(FilterItem, {
      localVue,
      propsData: {
        value
      }
    });
    wrapper.find(".filter").trigger("click");

    expect(wrapper.emitted("click")).toBeTruthy();
  });

  it("should emit a toggle event when toggled", () => {
    const wrapper = shallowMount(FilterItem, {
      localVue,
      propsData: {
        value
      }
    });
    wrapper.find(".toggle").trigger("click");

    expect(wrapper.emitted().input.length).toBe(1);
    expect(wrapper.emitted().input[0][0]).toEqual({ ...value, selected: true });
  });
});
