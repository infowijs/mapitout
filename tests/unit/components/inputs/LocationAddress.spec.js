import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";

import LocationAddress from "@/components/input/LocationAddress.vue";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("LocationAddress", () => {
  let addressStoreModule;
  let $store;

  beforeEach(() => {
    addressStoreModule = {
      namespaced: true,
      actions: {
        search: jest.fn().mockResolvedValue([]),
        resolve: jest.fn()
      }
    };
    $store = new Vuex.Store({
      modules: {
        address: addressStoreModule
      }
    });
  });

  it("should create", () => {
    const wrapper = shallowMount(LocationAddress, {
      localVue
    });

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it("should initialize with the passed in value string", () => {
    const initialValue = {
      value: "aaaa",
      coordinates: { lat: 1, lng: 2 }
    };
    const wrapper = shallowMount(LocationAddress, {
      localVue,
      propsData: {
        value: initialValue
      }
    });

    expect(wrapper.vm.query).toEqual(initialValue.value);
  });

  it("should mask the input by default and hide the mask on focus", () => {
    const wrapper = shallowMount(LocationAddress, {
      localVue
    });

    expect(wrapper.contains(".mask")).toBeTruthy();

    wrapper.find("input").trigger("focus");

    expect(wrapper.contains(".mask")).toBeFalsy();
  });

  it("should fetch the suggestions on user input", () => {
    const wrapper = shallowMount(LocationAddress, {
      localVue
    });

    const suggestSpy = jest.spyOn(wrapper.vm, "suggest");

    wrapper.find("input").setValue("aaa");

    expect(suggestSpy).toHaveBeenCalledWith("aaa");
  });

  it("should debounce the suggestion calls on user input", done => {
    const wrapper = shallowMount(LocationAddress, {
      localVue,
      mocks: { $store }
    });

    wrapper.find("input").setValue("aaa");
    wrapper.find("input").setValue("aaaa");

    setTimeout(() => {
      expect(addressStoreModule.actions.search).toHaveBeenCalledTimes(1);

      done();
    }, 550);
  });

  it("should clear suggestions for queries shorter than 3 characters", done => {
    const wrapper = shallowMount(LocationAddress, {
      localVue,
      mocks: { $store }
    });

    wrapper.vm.suggest("aa");

    setTimeout(() => {
      expect(addressStoreModule.actions.search).not.toHaveBeenCalled();
      expect(wrapper.vm.suggestions).toEqual([]);
      expect(wrapper.vm.displaySuggestions).toBeFalsy();
      done();
    }, 550);
  });

  it("should fetch suggestions for queries longer than 2 characters", done => {
    const wrapper = shallowMount(LocationAddress, {
      localVue,
      mocks: { $store }
    });
    const query = "aaa";

    addressStoreModule.actions.search.mockResolvedValue([{}]);

    wrapper.vm.suggest(query);

    setTimeout(() => {
      expect(addressStoreModule.actions.search).toHaveBeenCalled();
      expect(wrapper.vm.displaySuggestions).toBeTruthy();

      done();
    }, 550);
  });

  it("should select a list item whenever a user clicks / taps on it", () => {
    const wrapper = shallowMount(LocationAddress, {
      localVue
    });

    const selectSpy = jest.spyOn(wrapper.vm, "select").mockImplementation();

    wrapper.vm.suggestions = [
      { id: "test-id", address: "test-address" },
      { id: "test-id2", address: "test-address2" }
    ];
    wrapper.vm.displaySuggestions = true;

    wrapper
      .findAll("li")
      .at(0)
      .trigger("click");

    expect(selectSpy).toHaveBeenCalledWith(0);

    wrapper
      .findAll("li")
      .at(1)
      .trigger("click");

    expect(selectSpy).toHaveBeenCalledWith(1);
  });

  it("should select the focused index whenever the user punches the Enter key, if any", () => {
    const wrapper = shallowMount(LocationAddress, {
      localVue
    });

    const selectSpy = jest.spyOn(wrapper.vm, "select").mockImplementation();

    wrapper.vm.focusedListIndex = 0;

    wrapper.trigger("keydown", {
      key: "Enter"
    });

    expect(selectSpy).toHaveBeenCalledWith(0);
  });

  it("should clear the currently set value whenever the user punches the Enter key with no focused index", () => {
    const wrapper = shallowMount(LocationAddress, {
      localVue,
      propsData: {
        value: {
          value: "aaa",
          coordinates: {
            lat: 1,
            lng: 2
          }
        }
      }
    });

    wrapper.vm.focusedListIndex = -1;
    wrapper.vm.query = "aaaa";

    wrapper.trigger("keydown", {
      key: "Enter"
    });

    expect(wrapper.emitted("input")[0]).toEqual([{ value: "", coordinates: { lat: 0, lng: 0 } }]);
  });

  it("should default select the first item in the list whenever the list id displayed and deselect it on hide", () => {
    const wrapper = shallowMount(LocationAddress, {
      localVue
    });

    wrapper.vm.displaySuggestions = true;

    expect(wrapper.vm.focusedListIndex).toEqual(0);

    wrapper.vm.displaySuggestions = false;

    expect(wrapper.vm.focusedListIndex).toEqual(-1);
  });

  it("should attempt to resolve the selected item", () => {
    const wrapper = shallowMount(LocationAddress, {
      localVue,
      mocks: { $store }
    });

    const suggestions = [
      { id: "test-id", address: "test-address" },
      { id: "test-id2", address: "test-address2" }
    ];

    wrapper.vm.suggestions = suggestions;
    wrapper.vm.displaySuggestions = true;

    wrapper.vm.select(0);

    expect(addressStoreModule.actions.resolve).toHaveBeenCalled();
    expect(addressStoreModule.actions.resolve.mock.calls[0][1]).toEqual(suggestions[0].id);
  });

  it("should update the value, query and hide the suggestions on a successful resolve after selection", async () => {
    const wrapper = shallowMount(LocationAddress, {
      localVue,
      mocks: { $store }
    });

    const suggestions = [
      { id: "test-id", address: "test-address" },
      { id: "test-id2", address: "test-address2" }
    ];
    const resolvedCooordinates = { lat: 1, lng: 2 };

    wrapper.vm.suggestions = suggestions;

    addressStoreModule.actions.resolve.mockResolvedValue(resolvedCooordinates);

    await wrapper.vm.select(0);

    expect(wrapper.emitted("input")[0]).toEqual([
      {
        value: suggestions[0].address,
        coordinates: resolvedCooordinates
      }
    ]);
    expect(wrapper.vm.query).toEqual(suggestions[0].address);
    expect(wrapper.vm.displaySuggestions).toEqual(false);
  });
});
