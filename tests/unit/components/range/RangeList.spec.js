import { shallowMount, createLocalVue } from "@vue/test-utils";

import Ranges from "@/components/range/RangeList.vue";
import Range from "@/components/range/Range.vue";
import ranges from "@/store/modules/ranges";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("RangeList", () => {
  const addRangeSpy = jest.spyOn(ranges.actions, "add");
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

  it("should update the activeRangeId if the active range is removed", () => {
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
