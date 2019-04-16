import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";

import Range from "@/components/range/Range.vue";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("Range", () => {
  const store = new Vuex.Store({
    modules: {
      origins: {
        namespaced: true,
        state: {
          types: [{ id: 0, value: "wellness", label: "Well" }]
        },
        actions: {
          lookup: jest.fn()
        }
      },
      transports: {
        namespaced: true,
        state: {
          types: [{ id: 0, value: "walking", label: "Walking" }]
        }
      }
    }
  });
  const range = {
    id: 0,
    originTypeId: 0,
    originId: "",
    origin: "",
    transportTypeId: 0,
    travelTime: 45,
    departureTime: new Date().toISOString()
  };
  it("should create", () => {
    const wrapper = shallowMount(Range, {
      localVue,
      store,
      stubs: ["location-input"],
      propsData: {
        value: range
      }
    });

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it("should emit an input event whenever the origin property changes", () => {
    const wrapper = shallowMount(Range, {
      localVue,
      store,
      propsData: {
        value: range
      }
    });

    const origin = {
      typeId: 0,
      address: "different",
      addressId: "different"
    };

    wrapper.vm.onLocationInput(origin);

    expect(wrapper.emitted().input).toBeTruthy();
    expect(wrapper.emitted().input.length).toBe(1);
    expect(wrapper.emitted().input[0]).toEqual([
      {
        ...wrapper.vm.value,
        originTypeId: origin.typeId,
        originId: origin.addressId,
        origin: origin.address
      }
    ]);
  });

  it("should emit an input event whenever the travelTime property changes", () => {
    const wrapper = shallowMount(Range, {
      localVue,
      store,
      propsData: {
        value: range
      }
    });
    const travelTime = 10;

    wrapper.vm.onTravelTimeInput(travelTime);

    expect(wrapper.emitted().input).toBeTruthy();
    expect(wrapper.emitted().input.length).toBe(1);
    expect(wrapper.emitted().input[0]).toEqual([
      {
        ...wrapper.vm.value,
        travelTime: travelTime,
        departureTime: wrapper.vm.getDepartureTime(new Date()).toISOString()
      }
    ]);
  });

  it("should emit an input event whenever the transportType property changes", () => {
    const wrapper = shallowMount(Range, {
      localVue,
      store,
      propsData: {
        value: range
      }
    });
    const transportType = 2;

    wrapper.vm.onTransportTypeInput(transportType);

    expect(wrapper.emitted().input).toBeTruthy();
    expect(wrapper.emitted().input.length).toBe(1);
    expect(wrapper.emitted().input[0]).toEqual([
      {
        ...wrapper.vm.value,
        transportTypeId: transportType
      }
    ]);
  });

  it("should update its child models on value change", () => {
    const newRange = {
      id: 0,
      originTypeId: 1,
      originId: "test",
      origin: "test",
      transportTypeId: 1,
      travelTime: 60,
      departureTime: new Date().toISOString()
    };
    const wrapper = shallowMount(Range, {
      localVue,
      store,
      propsData: {
        value: range
      }
    });

    wrapper.setProps({
      value: newRange
    });

    expect(wrapper.vm.transportTypeId).toBe(newRange.transportTypeId);
    expect(wrapper.vm.travelTime).toBe(newRange.travelTime);
    expect(wrapper.vm.origin).toEqual({
      typeId: newRange.originTypeId,
      addressId: newRange.originId,
      address: newRange.origin
    });
  });

  describe("getDepartureTime", () => {
    it("should return the current day 9AM GMT+1 if the current day is a Monday", () => {
      const wrapper = shallowMount(Range, {
        localVue,
        store,
        propsData: {
          value: range
        }
      });

      const date = new Date(2019, 3, 1, 13, 1, 0, 0);

      const departureTime = wrapper.vm.getDepartureTime(date);

      expect(departureTime.toISOString()).toBe("2019-04-01T09:00:00.000Z");
    });

    it("should return the next Monday9AM GMT+1 if the current day is not a Monday", () => {
      const wrapper = shallowMount(Range, {
        localVue,
        store,
        propsData: {
          value: range
        }
      });

      const date = new Date(2019, 3, 5, 13, 1, 0, 0);

      const departureTime = wrapper.vm.getDepartureTime(date);

      expect(departureTime.toISOString()).toBe("2019-04-08T09:00:00.000Z");
    });
  });
});
