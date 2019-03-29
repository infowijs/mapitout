import { shallowMount, createLocalVue } from "@vue/test-utils";

import LocationInput from "@/components/input/LocationInput.vue";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("LocationInput", () => {
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
    const wrapper = shallowMount(LocationInput, {
      localVue,
      mocks: {
        $store
      }
    });

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it("should trigger a setValue call whenever the type property changes ", () => {
    const wrapper = shallowMount(LocationInput, {
      localVue,
      mocks: {
        $store
      }
    });

    wrapper.setData({
      type: "work"
    });

    expect(wrapper.emitted("input")).toBeTruthy();
  });

  it("should trigger a setValue call whenever the address property changes ", () => {
    const wrapper = shallowMount(LocationInput, {
      localVue,
      mocks: {
        $store
      }
    });

    wrapper.vm.address = {
      id: "different",
      label: "different",
      value: { lat: 2, lng: 3 }
    };

    expect(wrapper.emitted("input")).toBeTruthy();
  });
});
