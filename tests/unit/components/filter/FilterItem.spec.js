import { shallowMount, createLocalVue } from "@vue/test-utils";

import FilterItem from "@/components/filter/FilterItem.vue";

const localVue = createLocalVue();

describe("FilterItem", () => {
  it("should create", () => {
    const wrapper = shallowMount(FilterItem, {
      localVue,
      propsData: {
        filter: {
          icon: "icon-bus"
        }
      }
    });

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it("should emit a click event on any wrapper clicks", () => {
    const wrapper = shallowMount(FilterItem, {
      localVue,
      propsData: {
        filter: {
          icon: "icon-bus"
        }
      }
    });
    wrapper.find(".filter").trigger("click");

    expect(wrapper.emitted("click")).toBeTruthy();
  });

  it("should emit a toggle event when toggled", () => {
    const wrapper = shallowMount(FilterItem, {
      localVue,
      propsData: {
        filter: {
          icon: "icon-bus"
        }
      }
    });
    wrapper.find(".toggle").trigger("click");

    expect(wrapper.emitted("toggle")).toBeTruthy();
  });
});
