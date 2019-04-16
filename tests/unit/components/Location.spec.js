import { shallowMount, createLocalVue } from "@vue/test-utils";

import Location from "@/components/Location.vue";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("Location", () => {
  const propsData = {
    types: [],
    lookupAddress: jest.fn(),
    resolveAddressId: jest.fn()
  };

  it("should create", () => {
    const wrapper = shallowMount(Location, {
      localVue,
      propsData
    });

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it("should emit an input event whenever the typeId changes ", () => {
    const wrapper = shallowMount(Location, {
      localVue,
      propsData
    });

    wrapper.vm.onTypeInput(2);

    expect(wrapper.emitted().input).toBeTruthy();
    expect(wrapper.emitted().input.length).toBe(1);
    expect(wrapper.emitted().input[0]).toEqual([{ ...wrapper.vm.value, typeId: 2 }]);
  });

  it("should emit and input event whenever the address changes ", () => {
    const wrapper = shallowMount(Location, {
      localVue,
      propsData
    });
    const address = {
      id: "different",
      address: "different"
    };

    wrapper.vm.onAddressInput(address);

    expect(wrapper.emitted().input).toBeTruthy();
    expect(wrapper.emitted().input.length).toBe(1);
    expect(wrapper.emitted().input[0]).toEqual([
      {
        ...wrapper.vm.value,
        addressId: address.id,
        address: address.address
      }
    ]);
  });

  it("should pass on the updated value to its child components", () => {
    const wrapper = shallowMount(Location, {
      localVue,
      propsData: {
        ...propsData,
        value: {
          addressId: "test-id",
          address: "test"
        }
      }
    });
    const value = {
      addressId: "different",
      address: "different",
      typeId: 1
    };

    wrapper.setProps({
      value
    });

    expect(wrapper.vm.address).toEqual({
      id: value.addressId,
      address: value.address
    });
  });
});
