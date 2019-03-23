import { shallowMount, createLocalVue } from "@vue/test-utils";

import Location from "@/components/input/Location.vue";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("Location", () => {
  let $store;

  beforeEach(() => {
    $store = new Vuex.Store({
      modules: {
        address: {
          namespaced: true,
          state: {
            types: [
              { id: "type-1", label: "type-1-label" },
              { id: "type-2", label: "type-2-label" }
            ]
          },
          actions: {
            search: jest.fn(),
            resolve: jest.fn()
          }
        }
      }
    });
  });

  it("should create", () => {
    const wrapper = shallowMount(Location, {
      localVue,
      mocks: {
        $store
      }
    });

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it("should trigger a setValue call whenever the type or address change ", () => {
    const wrapper = shallowMount(Location, {
      localVue,
      mocks: {
        $store
      },
      propsData: {
        value: {
          type: "home",
          address: null
        }
      }
    });

    const setValueSpy = jest.spyOn(wrapper.vm, "setValue").mockImplementation();

    wrapper.setData({
      type: "test-value"
    });

    wrapper.setData({
      address: {}
    });

    expect(setValueSpy).toHaveBeenCalledTimes(2);
  });

  it("should emit a value change whenever the resolved address value changes", () => {
    const wrapper = shallowMount(Location, {
      localVue,
      mocks: {
        $store
      }
    });

    wrapper.vm.setValue({
      type: "test-value"
    });

    wrapper.vm.setValue({
      address: {}
    });

    expect(wrapper.emitted().input.length).toBeTruthy();
  });
});
