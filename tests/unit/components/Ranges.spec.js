import { shallowMount, createLocalVue } from "@vue/test-utils";

import Ranges from "@/components/Ranges.vue";
import Range from "@/components/Range.vue";
import ranges from "@/store/modules/ranges";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("Ranges", () => {
  const addRangeSpy = jest.spyOn(ranges.actions, "add");
  const updateRangeSpy = jest.spyOn(ranges.actions, "update");
  const removeRangeSpy = jest.spyOn(ranges.actions, "remove");
  let $store;

  beforeEach(() => {
    jest.resetAllMocks();

    $store = new Vuex.Store({
      modules: {
        ranges
      }
    });

    $store.state.ranges.ranges.forEach(range => {
      $store.commit("ranges/remove", range.id);
    });
  });

  it("should create", () => {
    const wrapper = shallowMount(Ranges, {
      localVue,
      mocks: {
        $store
      }
    });

    expect(wrapper.isVueInstance()).toBeTruthy();
    expect(addRangeSpy).toHaveBeenCalled();
  });

  it("should correctly render the store contained ranges", () => {
    const wrapper = shallowMount(Ranges, {
      localVue,
      mocks: {
        $store
      }
    });

    $store.commit("ranges/add");

    expect(wrapper.findAll(Range).length).toBe(1);
  });

  it("should update the activeRangeId the active range is removed", () => {
    const wrapper = shallowMount(Ranges, {
      localVue,
      mocks: {
        $store
      }
    });

    $store.commit("ranges/add");
    $store.commit("ranges/add");

    wrapper
      .findAll("button.delete")
      .at(1)
      .trigger("click");

    expect(removeRangeSpy).toHaveBeenCalled();
  });

  it("should update the activeRangeId when an inactive range is clicked", () => {
    const wrapper = shallowMount(Ranges, {
      localVue,
      mocks: {
        $store
      }
    });

    $store.commit("ranges/add");
    $store.commit("ranges/add");

    wrapper
      .findAll("li")
      .at(2)
      .trigger("click");

    expect(wrapper.vm.activeRangeId).toBe(wrapper.vm.ranges[2].id);
  });

  // todo not sure why this does not work
  xit("should update the range whenever a range component emits an input event", () => {
    const wrapper = shallowMount(Ranges, {
      localVue,
      mocks: {
        $store
      }
    });
    const updatedRange = { id: "range-0", testKey: "test" };

    wrapper.find(Range).trigger("input", updatedRange);

    expect(updateRangeSpy).toHaveBeenCalledWith(updatedRange);
  });

  it("should add a range whenever clicking the addRange button", () => {
    const wrapper = shallowMount(Ranges, {
      localVue,
      mocks: {
        $store
      }
    });

    wrapper.find("button.add").trigger("click");

    expect(addRangeSpy).toHaveBeenCalled();
  });
});
