import { shallowMount, createLocalVue } from "@vue/test-utils";

import EnhancedSelect from "@/components/input/EnhancedSelect.vue";

const localVue = createLocalVue();

describe("EnhancedSelect", () => {
  it("should create", () => {
    const wrapper = shallowMount(EnhancedSelect, {
      localVue
    });

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it("should display the list upon clicking the trigger", () => {
    const wrapper = shallowMount(EnhancedSelect, {
      localVue
    });

    wrapper.find("button").trigger("click");

    expect(wrapper.vm.isListVisible).toBeTruthy();
  });

  it("should skip displaying the list upon clicking the trigger when the component is disabled", () => {
    const wrapper = shallowMount(EnhancedSelect, {
      localVue,
      propsData: {
        isDisabled: true
      }
    });

    wrapper.find("button").trigger("click");

    expect(wrapper.vm.isListVisible).toBeFalsy();
  });

  it("should hide the list upon clicking the trigger a second time", () => {
    const wrapper = shallowMount(EnhancedSelect, {
      localVue
    });

    wrapper.setData({ isListVisible: true });

    wrapper.find("button").trigger("click");

    expect(wrapper.vm.isListVisible).toBeFalsy();
  });

  it("should trigger a selection whenever clicking on an enhanced list element button", () => {
    const selectedOption = { value: "test-val", label: "test-label" };
    const wrapper = shallowMount(EnhancedSelect, {
      localVue,
      propsData: {
        options: [selectedOption]
      }
    });
    const selectOptionSpy = jest.spyOn(wrapper.vm, "selectOption");

    wrapper.setData({ isListVisible: true });

    wrapper.find("ul li button").trigger("click");

    expect(selectOptionSpy).toHaveBeenCalledWith(selectedOption.value);
  });

  it("should trigger a selection whenever selecting an option from the native select element", () => {
    const selectedOption = { value: "test-val", label: "test-label" };
    const wrapper = shallowMount(EnhancedSelect, {
      localVue,
      propsData: {
        options: [selectedOption]
      }
    });

    const selectOptionSpy = jest.spyOn(wrapper.vm, "selectOption");

    wrapper.findAll("select").trigger("change");

    expect(selectOptionSpy).toHaveBeenCalledWith(selectedOption.value);
  });

  it("should update the model, hide the enhanced list and emit a value change whenever a selection is triggered", () => {
    const selectedValue = "test";
    const wrapper = shallowMount(EnhancedSelect, {
      localVue
    });

    wrapper.setData({
      isListVisible: true
    });

    wrapper.vm.selectOption(selectedValue);

    expect(wrapper.vm.isListVisible).toBeFalsy();
    expect(wrapper.vm.selected).toEqual(selectedValue);
    expect(wrapper.emitted().input[0]).toEqual([selectedValue]);
  });
});
