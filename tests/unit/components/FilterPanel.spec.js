import { shallowMount, createLocalVue, mount } from "@vue/test-utils";
import Vuex from "vuex";

import FiltersPanel from "@/components/FiltersPanel.vue";
import FilterItem from "@/components/filter/FilterItem";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("FiltersPanel", () => {
  const filters = [
    {
      id: 1,
      name: "Stations",
      value: "Station",
      category: null,
      root: true,
      propertyId: null,
      selected: false,
      parent: null,
      children: null,
      icon: "icon-bus"
    },
    {
      id: 2,
      name: "Schools",
      value: "School",
      category: null,
      root: true,
      propertyId: null,
      selected: false,
      parent: null,
      children: [4, 5, 6, 7, 8],
      icon: "icon-education"
    },
    {
      id: 3,
      name: "Age Range 4-11",
      value: "Age range 4-11",
      category: "School programs",
      root: false,
      propertyId: 1,
      selected: false,
      parent: 2,
      children: null,
      icon: "icon-education"
    },
    {
      id: 7,
      name: "International Schools",
      value: "International schools",
      category: "School system",
      root: false,
      propertyId: 5,
      selected: false,
      parent: 2,
      children: null,
      icon: "icon-education"
    }
  ];
  const store = new Vuex.Store({
    modules: {
      filters: {
        namespaced: true,
        state: {
          filters
        }
      }
    }
  });

  it("should create", () => {
    const wrapper = shallowMount(FiltersPanel, {
      localVue,
      store
    });

    expect(wrapper.isVueInstance()).toBeTruthy();
    expect(wrapper.vm.groups).toEqual([
      [
        { icon: "icon-bus", label: "null" },
        [
          {
            category: null,
            children: null,
            icon: "icon-bus",
            id: 1,
            name: "Stations",
            parent: null,
            propertyId: null,
            root: true,
            selected: false,
            value: "Station"
          },
          {
            category: null,
            children: [4, 5, 6, 7, 8],
            icon: "icon-education",
            id: 2,
            name: "Schools",
            parent: null,
            propertyId: null,
            root: true,
            selected: false,
            value: "School"
          }
        ]
      ]
    ]);
  });

  it("should emmit an input event when clicking close", () => {
    const wrapper = shallowMount(FiltersPanel, {
      localVue,
      store,
      propsData: {
        value: true
      }
    });
    wrapper.find("button.close").trigger("click");

    expect(wrapper.emitted().input.length).toBe(1);
    expect(wrapper.emitted().input[0]).toEqual([false]);
  });

  it("should render the root filters when clicking back", () => {
    const wrapper = shallowMount(FiltersPanel, {
      localVue,
      store,
      data() {
        return {
          viewing: filters[1]
        };
      }
    });
    wrapper.find("button.back").trigger("click");

    expect(wrapper.vm.viewing).toBeNull();
  });

  it("should render the child filters when clicking on a filter that has children", () => {
    const wrapper = mount(FiltersPanel, {
      localVue,
      store
    });

    wrapper
      .findAll(FilterItem)
      .at(1)
      .trigger("click", filters[1]);

    expect(wrapper.vm.viewing).toEqual(filters[1]);
  });

  it("should render the child filters when clicking on a filter that has children", () => {
    const wrapper = mount(FiltersPanel, {
      localVue,
      store
    });

    wrapper
      .findAll(FilterItem)
      .at(1)
      .trigger("click", filters[1]);

    expect(wrapper.vm.viewing).toEqual(filters[1]);
  });

  it("should not attempt to render the child filters when clicking on a filter that has no children", () => {
    const wrapper = mount(FiltersPanel, {
      localVue,
      store
    });

    wrapper
      .findAll(FilterItem)
      .at(0)
      .trigger("click", filters[1]);

    expect(wrapper.vm.viewing).toBeNull();
  });

  it("should call navigate whenever a filter emits and input event", () => {
    const wrapper = mount(FiltersPanel, {
      localVue,
      store
    });

    const updatedFilter = { ...filters[1], selected: true };

    const navigateSpy = jest.spyOn(wrapper.vm, "navigate").mockImplementation();

    wrapper.vm.onFilterInput(updatedFilter);

    const expectedResult = [...filters];

    expectedResult.splice(1, 1, updatedFilter);

    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(expectedResult);
  });

  it("should route with the correct query string on navigation whenever filters change", () => {
    const pushSpy = jest.fn();
    const wrapper = mount(FiltersPanel, {
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

    const updatedFilters = [...filters];

    updatedFilters.splice(
      0,
      2,
      { ...filters[0], selected: true },
      { ...filters[1], selected: true }
    );

    wrapper.vm.navigate(updatedFilters);

    expect(pushSpy).toHaveBeenCalledTimes(1);
    expect(pushSpy).toHaveBeenCalledWith({ query: { f: "0=1&1=2" } });
  });

  it("should route with an empty query string on navigation whenever all filters are deselected", () => {
    const pushSpy = jest.fn();
    const wrapper = mount(FiltersPanel, {
      localVue,
      store,
      mocks: {
        $route: {
          query: {
            f: "test"
          }
        },
        $router: {
          push: pushSpy
        }
      }
    });

    wrapper.vm.navigate(filters);

    expect(pushSpy).toHaveBeenCalledTimes(1);
    expect(pushSpy).toHaveBeenCalledWith({ query: { f: undefined } });
  });

  it("should not push on navigation whenever filters do not change", () => {
    const pushSpy = jest.fn();
    const wrapper = mount(FiltersPanel, {
      localVue,
      store,
      mocks: {
        $route: {
          query: { f: "0=1&1=2" }
        },
        $router: {
          push: pushSpy
        }
      }
    });

    const updatedFilters = [...filters];

    updatedFilters.splice(
      0,
      2,
      { ...filters[0], selected: true },
      { ...filters[1], selected: true }
    );

    wrapper.vm.navigate(updatedFilters);

    expect(pushSpy).not.toHaveBeenCalled();
  });
});
