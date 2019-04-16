import { shallowMount, createLocalVue } from "@vue/test-utils";

import TransportType from "@/components/TransportType.vue";

const localVue = createLocalVue();

describe("TransportType", () => {
  it("should create", () => {
    const wrapper = shallowMount(TransportType, {
      localVue,
      propsData: {
        options: []
      }
    });

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it("should change its value upon clicking an option", () => {
    const wrapper = shallowMount(TransportType, {
      localVue,
      propsData: {
        options: [{ id: 0, value: "walking", label: "Walking", icon: "icon-transport-pedestrian" }]
      }
    });

    wrapper.vm.onListItemClick(1);

    expect(wrapper.emitted().input.length).toBe(1);
    expect(wrapper.emitted().input[0]).toEqual([1]);
  });
});
