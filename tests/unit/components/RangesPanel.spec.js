import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";

import RangesPanel from "@/components/RangesPanel.vue";
import flushPromises from "flush-promises";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("RangesPanel", () => {
  const addSpy = jest.fn();
  const activateSpy = jest.fn();
  const replaceSpy = jest.fn();

  const store = new Vuex.Store({
    modules: {
      ranges: {
        namespaced: true,
        actions: {
          add: addSpy,
          activate: activateSpy,
          replace: replaceSpy
        },
        state: {
          ranges: []
        }
      }
    }
  });

  beforeEach(() => {
    store.replaceState({
      ranges: {
        ranges: []
      }
    });

    jest.resetAllMocks();
  });

  it("should create", async () => {
    const initSpy = jest.fn();

    const wrapper = shallowMount(RangesPanel, {
      localVue,
      store,
      methods: {
        init: initSpy
      }
    });

    await flushPromises();

    expect(wrapper.isVueInstance()).toBeTruthy();
    expect(initSpy).toHaveBeenCalledTimes(1);
  });

  it("should reinitialise on route update", async () => {
    const initSpy = jest.fn();
    const nextSpy = jest.fn();

    const wrapper = shallowMount(RangesPanel, {
      localVue,
      store,
      methods: {
        init: initSpy
      }
    });

    await flushPromises();

    initSpy.mockReset();

    wrapper.vm.$options.beforeRouteUpdate.call(wrapper.vm, null, null, nextSpy);

    await flushPromises();

    expect(initSpy).toHaveBeenCalledTimes(1);
    expect(nextSpy).toHaveBeenCalledTimes(1);
  });

  it("should add and activate a range if the store state contains none on init", async () => {
    addSpy.mockResolvedValue({});

    shallowMount(RangesPanel, {
      localVue,
      store
    });

    store.replaceState({
      ranges: {
        ranges: [{ id: 0 }]
      }
    });

    await flushPromises();

    expect(addSpy).toHaveBeenCalledTimes(1);
    expect(activateSpy).toHaveBeenCalledTimes(1);
    expect(activateSpy.mock.calls[0][1]).toBe(0);
  });

  it("should activate the last range in the store state", async () => {
    store.replaceState({
      ranges: {
        ranges: [{ id: 1 }]
      }
    });
    shallowMount(RangesPanel, {
      localVue,
      store
    });

    await flushPromises();

    expect(activateSpy).toHaveBeenCalledTimes(1);
    expect(activateSpy.mock.calls[0][1]).toBe(1);
  });

  it("should navigate on deleting a range", async () => {
    store.replaceState({
      ranges: {
        ranges: [{ id: 1 }, { id: 2 }]
      }
    });
    const navigateSpy = jest.fn();

    const wrapper = shallowMount(RangesPanel, {
      localVue,
      store,
      methods: {
        navigate: navigateSpy
      }
    });

    await flushPromises();

    wrapper.vm.onRangeRemove(null, 1);

    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith([{ id: 2 }]);
  });

  it("should activate an inactive range when clicking on it", async () => {
    store.replaceState({
      ranges: {
        activeId: 1,
        ranges: [{ id: 1 }, { id: 2 }]
      }
    });

    const wrapper = shallowMount(RangesPanel, {
      localVue,
      store
    });

    await flushPromises();

    activateSpy.mockReset();

    wrapper.vm.onRangeClick(null, 2);

    expect(activateSpy).toHaveBeenCalledTimes(1);
    expect(activateSpy.mock.calls[0][1]).toBe(2);
  });

  it("should navigate on updating a range", async () => {
    store.replaceState({
      ranges: {
        activeId: 1,
        ranges: [{ id: 1 }, { id: 2 }]
      }
    });
    const navigateSpy = jest.fn();

    const wrapper = shallowMount(RangesPanel, {
      localVue,
      store,
      methods: {
        navigate: navigateSpy
      }
    });

    await flushPromises();

    wrapper.vm.onRangeChange({ id: 1, value: "test" });

    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith([{ id: 1, value: "test" }, { id: 2 }]);
  });

  it("should add and activate a range when clicking on the add range button", async () => {
    store.replaceState({
      ranges: {
        activeId: 1,
        ranges: [{ id: 1 }]
      }
    });

    const wrapper = shallowMount(RangesPanel, {
      localVue,
      store
    });

    await flushPromises();

    addSpy.mockReset();
    activateSpy.mockReset();

    wrapper.find("button.add").trigger("click");

    store.replaceState({
      ranges: {
        activeId: 1,
        ranges: [{ id: 1 }, { id: 2 }]
      }
    });

    await flushPromises();

    expect(addSpy).toHaveBeenCalledTimes(1);
    expect(activateSpy).toHaveBeenCalledTimes(1);
    expect(activateSpy.mock.calls[0][1]).toBe(2);
  });

  it("should re-route when the ranges change", async () => {
    const pushSpy = jest.fn();

    store.replaceState({
      ranges: {
        activeId: 1,
        ranges: [{ id: 1 }, { id: 2 }]
      }
    });

    const wrapper = shallowMount(RangesPanel, {
      localVue,
      store,
      mocks: {
        $route: {
          query: {}
        },
        $router: {
          push: pushSpy
        }
      }
    });

    const ranges = [
      {
        id: 0,
        originTypeId: 0,
        originId: "test",
        origin: "test",
        transportTypeId: 0,
        travelTime: 45,
        departureTime: new Date().toISOString()
      }
    ];

    wrapper.vm.navigate(ranges);

    expect(pushSpy).toHaveBeenCalledTimes(1);
    expect(pushSpy).toHaveBeenCalledWith({
      query: {
        r: `0%5Bid%5D=0&0%5BotId%5D=0&0%5BoId%5D=test&0%5Bo%5D=test&0%5BttId%5D=0&0%5Btt%5D=45&0%5Bt%5D=${new Date(
          ranges[0].departureTime
        ).getTime()}`
      }
    });
  });

  it("should avoid re-routing when navigation is pushed with the same ranges", async () => {
    const pushSpy = jest.fn();

    store.replaceState({
      ranges: {
        activeId: 1,
        ranges: [{ id: 1 }, { id: 2 }]
      }
    });

    const ranges = [
      {
        id: 0,
        originTypeId: 0,
        originId: "test",
        origin: "test",
        transportTypeId: 0,
        travelTime: 45,
        departureTime: new Date().toISOString()
      }
    ];

    const wrapper = shallowMount(RangesPanel, {
      localVue,
      store,
      mocks: {
        $route: {
          query: {
            r: `0%5Bid%5D=0&0%5BotId%5D=0&0%5BoId%5D=test&0%5Bo%5D=test&0%5BttId%5D=0&0%5Btt%5D=45&0%5Bt%5D=${new Date(
              ranges[0].departureTime
            ).getTime()}`
          }
        },
        $router: {
          push: pushSpy
        }
      }
    });

    wrapper.vm.navigate(ranges);

    expect(pushSpy).not.toHaveBeenCalled();
  });
});
