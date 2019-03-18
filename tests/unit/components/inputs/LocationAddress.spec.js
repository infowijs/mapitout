import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";

import LocationAddress, { defaultValue } from "@/components/input/LocationAddress.vue";

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
      address: "initial address",
      coordinates: { lat: 1, lng: 2 }
    };
    const wrapper = shallowMount(LocationAddress, {
      localVue,
      propsData: {
        value: initialValue
      }
    });

    expect(wrapper.vm.query).toEqual(initialValue.address);
  });

  it("should mask the input by default and hide the mask on focus", () => {
    const wrapper = shallowMount(LocationAddress, {
      localVue
    });

    expect(wrapper.classes("focused")).toBeFalsy();

    wrapper.find("input").trigger("focus");

    expect(wrapper.classes("focused")).toBeTruthy();
  });

  it("should select the first item in the list whenever the list displayed", () => {
    const wrapper = shallowMount(LocationAddress, {
      localVue
    });
    wrapper.vm.focusedSuggestionIndex = -1;
    wrapper.vm.displaySuggestions = true;

    expect(wrapper.vm.focusedSuggestionIndex).toEqual(0);
  });

  it("should deselect the selected item in the list whenever the list hidden", () => {
    const wrapper = shallowMount(LocationAddress, {
      localVue
    });

    wrapper.vm.displaySuggestions = true;
    wrapper.vm.focusedSuggestionIndex = 1;
    wrapper.vm.displaySuggestions = false;

    expect(wrapper.vm.focusedSuggestionIndex).toEqual(-1);
  });

  it("should fetch the suggestions on user input", () => {
    const wrapper = shallowMount(LocationAddress, {
      localVue
    });

    const debouncedSuggestSpy = jest.spyOn(wrapper.vm, "debouncedSuggest").mockImplementation();

    wrapper.find("input").setValue("aaa");

    expect(debouncedSuggestSpy).toHaveBeenCalledWith("aaa");
  });

  it("should debounce the suggestion calls on user input", done => {
    const wrapper = shallowMount(LocationAddress, {
      localVue,
      mocks: { $store }
    });

    const suggestSpy = jest.spyOn(wrapper.vm, "suggest").mockImplementation();

    wrapper.find("input").setValue("aaa");
    wrapper.find("input").setValue("aaaa");
    wrapper.find("input").setValue("aaaaaaa");

    setTimeout(() => {
      expect(suggestSpy).toHaveBeenCalledTimes(1);

      done();
    }, 550);
  });

  it("should select the focused suggestion on Enter in the input control", () => {
    const wrapper = shallowMount(LocationAddress, {
      localVue
    });
    const selectedSuggestion = 1;

    const selectSpy = jest.spyOn(wrapper.vm, "select").mockImplementation();

    wrapper.vm.focusedSuggestionIndex = selectedSuggestion;

    wrapper.find("input").trigger("keydown", {
      key: "Enter"
    });

    expect(selectSpy).toHaveBeenCalledWith(selectedSuggestion);
  });

  it("should clear the value on Enter in the input control without a focused suggestion", () => {
    const wrapper = shallowMount(LocationAddress, {
      localVue,
      propsData: {
        value: {
          address: "aaa",
          coordinates: { lat: 1, lng: 2 }
        }
      }
    });

    wrapper.vm.focusedSuggestionIndex = -1;
    wrapper.vm.query = "bb";

    wrapper.find("input").trigger("keydown", {
      key: "Enter"
    });

    expect(wrapper.emitted("input")[0]).toEqual([defaultValue]);
  });

  it("should set its value whenever a user clicks on a suggestion", () => {
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

  it("should clear suggestions for queries shorter than 3 characters", async () => {
    const wrapper = shallowMount(LocationAddress, {
      localVue
    });

    await wrapper.vm.suggest("aa");

    expect(wrapper.vm.suggestions).toEqual([]);
    expect(wrapper.vm.displaySuggestions).toBeFalsy();
  });

  it("should fetch suggestions for queries longer than 2 characters", async () => {
    const wrapper = shallowMount(LocationAddress, {
      localVue,
      mocks: { $store }
    });
    const suggestions = [{ id: "test-id", address: "test-address" }];
    const query = "aaa";

    addressStoreModule.actions.search.mockResolvedValue(suggestions);

    await wrapper.vm.suggest(query);

    expect(addressStoreModule.actions.search).toHaveBeenCalled();
    expect(wrapper.vm.displaySuggestions).toBeTruthy();
    expect(wrapper.vm.suggestions).toEqual(suggestions);
  });

  it("should skip on displaying the suggestions when none are returned", async () => {
    const wrapper = shallowMount(LocationAddress, {
      localVue,
      mocks: { $store }
    });
    const suggestions = [];
    const query = "aaa";

    addressStoreModule.actions.search.mockResolvedValue(suggestions);

    await wrapper.vm.suggest(query);

    expect(wrapper.vm.displaySuggestions).toBeFalsy();
  });

  it("should resolve the selected suggestion and hide the list", async () => {
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

    await wrapper.vm.select(0);

    expect(addressStoreModule.actions.resolve).toHaveBeenCalled();
    expect(addressStoreModule.actions.resolve.mock.calls[0][1]).toEqual(suggestions[0].id);
  });

  it("should set it value on a successful resolve", async () => {
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
        address: suggestions[0].address,
        coordinates: resolvedCooordinates
      }
    ]);
    expect(wrapper.vm.query).toEqual(suggestions[0].address);
  });
});
