import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";

import LocationAddress from "@/components/location/LocationAddress.vue";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("LocationAddress", () => {
  let search;
  let resolve;

  beforeEach(() => {
    search = jest.fn();
    resolve = jest.fn();
  });

  it("should create", () => {
    const wrapper = shallowMount(LocationAddress, {
      localVue,
      propsData: {
        search,
        resolve
      }
    });

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it("should change the emit a focus event whenever the input gains focus", () => {
    const wrapper = shallowMount(LocationAddress, {
      localVue,
      propsData: {
        search,
        resolve
      }
    });

    wrapper.find("input").trigger("focus");

    expect(wrapper.vm.isInputFocused).toBeTruthy();
    expect(wrapper.emitted("focus")).toBeTruthy();

    wrapper.find("input").trigger("blur");
  });

  it("should display the suggestions, if any, whenever the input gains focus", () => {
    const wrapper = shallowMount(LocationAddress, {
      localVue,
      propsData: {
        search,
        resolve
      }
    });

    wrapper.setData({
      suggestions: [
        { id: "test-id", address: "test-address" },
        { id: "test-id2", address: "test-address2" }
      ]
    });

    wrapper.find("input").trigger("focus");

    expect(wrapper.vm.areSuggestionsVisible).toBeTruthy();
  });

  it("should palce the cursor on the first suggestion in the list whenever the list displayed", () => {
    const wrapper = shallowMount(LocationAddress, {
      localVue,
      propsData: {
        search,
        resolve
      }
    });
    wrapper.setData({
      cursorIndex: -1,
      areSuggestionsVisible: true
    });

    expect(wrapper.vm.cursorIndex).toEqual(0);
  });

  it("should reset the cursor whenever this list is hidden", () => {
    const wrapper = shallowMount(LocationAddress, {
      localVue,
      propsData: {
        search,
        resolve
      },
      data() {
        return {
          areSuggestionsVisible: true
        };
      }
    });
    wrapper.setData({
      cursorIndex: 1
    });

    wrapper.setData({
      areSuggestionsVisible: false
    });

    expect(wrapper.vm.cursorIndex).toEqual(-1);
  });

  it("should add the focused class whenever the input gains focus", () => {
    const wrapper = shallowMount(LocationAddress, {
      localVue,
      propsData: {
        search,
        resolve
      }
    });

    wrapper.find("input").trigger("focus");

    expect(wrapper.classes("focused")).toBeTruthy();
  });

  it("should remove the focused class whenever the input loses focus", () => {
    const wrapper = shallowMount(LocationAddress, {
      localVue,
      propsData: {
        search,
        resolve
      }
    });

    wrapper.setData({ isInputFocused: true });

    wrapper.find("input").trigger("blur");

    expect(wrapper.classes("focused")).toBeFalsy();
  });

  it("should trigger debounced suggestions whenever the user inputs text", done => {
    const wrapper = shallowMount(LocationAddress, {
      localVue,
      propsData: {
        search,
        resolve
      }
    });

    const suggestSpy = jest.spyOn(wrapper.vm, "suggest").mockImplementation();
    const suggestedValue = "test-3";

    wrapper.find("input").setValue("aaa");
    wrapper.find("input").setValue("aaaa");
    wrapper.find("input").setValue(suggestedValue);

    setTimeout(() => {
      expect(suggestSpy).toHaveBeenCalledTimes(1);

      expect(suggestSpy).toHaveBeenLastCalledWith(suggestedValue);
      done();
    }, 550);
  });

  it("should trigger a selection whenever a user clicks on a suggestion", () => {
    const wrapper = shallowMount(LocationAddress, {
      localVue,
      propsData: {
        search,
        resolve
      }
    });
    const suggestions = [
      { id: "test-id", address: "test-address" },
      { id: "test-id2", address: "test-address2" }
    ];
    wrapper.setData({
      areSuggestionsVisible: true,
      suggestions
    });

    const selectSpy = jest.spyOn(wrapper.vm, "select").mockImplementation();

    wrapper
      .findAll(".option")
      .at(0)
      .trigger("click");

    expect(selectSpy).toHaveBeenCalledWith(0);
  });

  it("should trigger a selection of the cursor index when pressing Enter", () => {
    const wrapper = shallowMount(LocationAddress, {
      localVue,
      propsData: {
        search,
        resolve,
        value: {
          id: "test-id",
          address: "test address",
          lat: 1,
          lng: 2
        }
      }
    });

    const selectSpy = jest.spyOn(wrapper.vm, "select").mockImplementation();

    wrapper.setData({ cursorIndex: 0, query: "other address" });

    wrapper.find("input").trigger("keydown", {
      key: "Enter"
    });

    expect(selectSpy).toHaveBeenCalledWith(0);
  });

  it("should not trigger a selection of the cursor index when pressing any other key", () => {
    const wrapper = shallowMount(LocationAddress, {
      localVue,
      propsData: {
        search,
        resolve
      }
    });

    const selectSpy = jest.spyOn(wrapper.vm, "select").mockImplementation();

    wrapper.setData({ cursorIndex: 0 });

    wrapper.find("input").trigger("keydown", {
      key: "Y"
    });

    expect(selectSpy).not.toHaveBeenCalled();
  });

  it("should only search for queries longer than two characters", async () => {
    const wrapper = shallowMount(LocationAddress, {
      localVue,
      propsData: {
        search,
        resolve
      }
    });

    search.mockResolvedValue([]);
    const query = "aaa";

    await wrapper.vm.suggest("a");

    expect(search).not.toHaveBeenCalled();

    await wrapper.vm.suggest(query);

    expect(search).toHaveBeenCalledWith(query);
  });

  it("should clear the suggestion list for queries shorter than three characters", async () => {
    const wrapper = shallowMount(LocationAddress, {
      localVue,
      propsData: {
        search,
        resolve
      }
    });

    await wrapper.vm.suggest("a");

    expect(wrapper.vm.suggestions).toEqual([]);
    expect(wrapper.vm.areSuggestionsVisible).toBeFalsy();
  });

  it("should hide the list whenever a selection is triggered", async () => {
    const wrapper = shallowMount(LocationAddress, {
      localVue,
      propsData: {
        resolve,
        search
      }
    });

    wrapper.setData({
      areSuggestionsVisible: true
    });

    await wrapper.vm.select(-1);
  });

  it("should emit an input event with an empty value whenever an invalid selection is triggered on a set value", async () => {
    const wrapper = shallowMount(LocationAddress, {
      localVue,
      propsData: {
        search,
        resolve,
        value: {
          id: "",
          label: "dasd"
        }
      }
    });

    wrapper.setData({
      query: "aaa"
    });
    await wrapper.vm.select(-1);

    expect(wrapper.emitted().input[0][0]).toEqual({ id: "", address: "" });
  });

  it("should emit an input event whenever a selection is resolved", async () => {
    const wrapper = shallowMount(LocationAddress, {
      localVue,
      propsData: {
        search,
        resolve
      }
    });
    const resolved = {
      id: "test-id",
      label: "test-label",
      value: {}
    };

    wrapper.setData({
      suggestions: [{ id: resolved.id }]
    });

    resolve.mockResolvedValue(resolved);

    await wrapper.vm.select(0);

    expect(wrapper.emitted().input).toBeTruthy();
  });

  it("should not emit an input event whenever a selection is resolved to the already set value", async () => {
    const value = {
      id: "test-id",
      labe: "test-label"
    };
    const wrapper = shallowMount(LocationAddress, {
      localVue,
      propsData: {
        search,
        resolve,
        value
      }
    });

    wrapper.setData({
      suggestions: [value]
    });

    resolve.mockResolvedValue(value);

    await wrapper.vm.select(0);

    expect(wrapper.emitted("input")).toBeFalsy();
  });
});
