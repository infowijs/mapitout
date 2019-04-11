import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";

import DetailsPanel from "@/components/DetailsPanel.vue";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("DetailsPanel", () => {
  const lookupSpy = jest.fn();
  const store = new Vuex.Store({
    modules: {
      locations: {
        namespaced: true,
        state: {
          viewing: null
        },
        actions: {
          lookup: lookupSpy
        }
      }
    }
  });
  const $router = {
    back: jest.fn()
  };

  it("should create", () => {
    const wrapper = shallowMount(DetailsPanel, {
      localVue,
      store
    });

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it("should navigate back when clicking the back button", () => {
    const wrapper = shallowMount(DetailsPanel, {
      localVue,
      store,
      mocks: {
        $router
      }
    });

    wrapper.find(".back").trigger("click");

    expect($router.back).toHaveBeenCalledTimes(1);
  });
});
