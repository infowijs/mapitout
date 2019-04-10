import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";

import Range from "@/components/range/Range.vue";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("Range", () => {
  const range = {
    id: "range-0",
    originType: "home",
    originId: "",
    originAddress: "",
    originLat: null,
    originLng: null,
    transportType: "public_transport",
    travelTime: 45,
    highlightColor: "#ff0000"
  };
  it("should create", () => {
    const wrapper = shallowMount(Range, {
      localVue,
      propsData: {
        range
      }
    });

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it("should emit an input event whenever the origin property changes", () => {
    const wrapper = shallowMount(Range, {
      localVue,
      propsData: {
        range
      },
      store: new Vuex.Store({
        modules: {
          locations: {
            namespaced: true,
            state: {
              types: [{ value: "wellness", highlightColor: "#ff0000" }]
            }
          }
        }
      }),
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
      type: "wellness",
      addressId: "different",
      address: "different",
      coordinates: { lat: 1, lng: 2 }
    };

    expect(wrapper.emitted("change")).toBeTruthy();
  });

  it("should emit an input event whenever the travelTime property changes", () => {
    const wrapper = shallowMount(Range, {
      localVue,
      propsData: {
        range
      }
    });

    wrapper.setData({ travelTime: 10 });

    expect(wrapper.emitted("change")).toBeTruthy();
  });

  it("should emit an input event whenever the transportType property changes", () => {
    const wrapper = shallowMount(Range, {
      localVue,
      propsData: {
        range
      }
    });

    wrapper.setData({ transportType: "driving" });

    expect(wrapper.emitted("change")).toBeTruthy();
  });

  describe("getDepartureTime", () => {
    it("should return the current day 9AM GMT+1 if the current day is a Monday", () => {
      const wrapper = shallowMount(Range, {
        localVue,
        propsData: {
          range
        }
      });

      const date = new Date(2019, 3, 1, 13, 1, 0, 0);

      const departureTime = wrapper.vm.getDepartureTime(date);

      expect(departureTime.toISOString()).toBe("2019-04-01T09:00:00.000Z");
    });

    it("should return the next Monday9AM GMT+1 if the current day is not a Monday", () => {
      const wrapper = shallowMount(Range, {
        localVue,
        propsData: {
          range
        }
      });

      const date = new Date(2019, 3, 5, 13, 1, 0, 0);

      const departureTime = wrapper.vm.getDepartureTime(date);

      expect(departureTime.toISOString()).toBe("2019-04-08T09:00:00.000Z");
    });
  });
});
