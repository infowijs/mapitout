import { shallowMount, mount, createLocalVue } from "@vue/test-utils";

import LocationType from "@/components/input/LocationType.vue";
import Vue from "vue";

const localVue = createLocalVue();

describe("LocationType", () => {
  it("should create", () => {
    const wrapper = shallowMount(LocationType, {
      localVue
    });

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it("should display the list upon clicking the trigger", () => {
    const wrapper = shallowMount(LocationType, {
      localVue
    });

    wrapper.find("button").trigger("click");

    expect(wrapper.vm.isListVisible).toBeTruthy();
  });

  it("should hide the list upon clicking the trigger a second time", () => {
    const wrapper = shallowMount(LocationType, {
      localVue
    });

    wrapper.find("button").trigger("click");
    wrapper.find("button").trigger("click");
    expect(wrapper.vm.isListVisible).toBeFalsy();
  });

  it("should keep the list visible upon clicking anywhere inside of it", () => {
    const wrapper = shallowMount(LocationType, {
      localVue
    });

    wrapper.find("button").trigger("click");

    wrapper.trigger("click");

    expect(wrapper.vm.isListVisible).toBeTruthy();
  });

  it("should hide the list and trigger a selection whenever selecting an element from it", () => {
    const wrapper = shallowMount(LocationType, {
      localVue
    });
    const selectItemSpy = jest.spyOn(wrapper.vm, "selectItem");

    wrapper.find("button").trigger("click");

    wrapper.find("ul li:first-child button").trigger("click");

    expect(wrapper.vm.isListVisible).toBeFalsy();
    expect(selectItemSpy).toHaveBeenCalled();
  });

  it("should update the selected class and emit an input event whenever a selection is triggered", () => {
    const wrapper = shallowMount(LocationType, {
      localVue
    });
    const emitSpy = jest.spyOn(wrapper.vm, "$emit");
    const selectedValue = "home";

    wrapper.vm.selectItem(selectedValue);

    expect(emitSpy).toHaveBeenCalledWith("input", selectedValue);
  });

  it("should trigger a selection whenever selecting an element from native select element", () => {
    const wrapper = shallowMount(LocationType, {
      localVue
    });
    const selectItemSpy = jest.spyOn(wrapper.vm, "selectItem");

    wrapper
      .findAll("select option")
      .at(1)
      .trigger("change");

    expect(selectItemSpy).toHaveBeenCalled();
  });

  it("should hide the list upon clicking anywhere outside of the component", () => {
    const ParentComponent = Vue.component("Parent", {
      name: "Parent",
      components: { LocationType },
      template: "<div><div class='click-me'></div><location-type></location-type></div>"
    });

    const parentWrapper = mount(ParentComponent, {
      localVue,
      attachToDocument: true
    });

    const locationTypeWrapper = parentWrapper.find(LocationType);

    locationTypeWrapper.find("button").trigger("click");

    parentWrapper.find(".click-me").trigger("click");

    expect(locationTypeWrapper.vm.isListVisible).toBeFalsy();
  });

  it("should hide the list upon clicking anywhere outside of the component", () => {
    const ParentComponent = Vue.component("Parent", {
      name: "Parent",
      components: { LocationType },
      template: "<div><div class='click-me'></div><location-type></location-type></div>"
    });

    const parentWrapper = mount(ParentComponent, {
      localVue,
      attachToDocument: true
    });

    const locationTypeWrapper = parentWrapper.find(LocationType);

    locationTypeWrapper.find("button").trigger("click");

    parentWrapper.find(".click-me").trigger("click");

    expect(locationTypeWrapper.vm.isListVisible).toBeFalsy();
  });

  it("should add appropriate event listeners on the document at mount", () => {
    global.document.addEventListener = jest.fn();

    const wrapper = shallowMount(LocationType, {
      localVue
    });

    expect(document.addEventListener).toHaveBeenCalledWith("click", wrapper.vm.onDocumentClick);
  });

  it("should remove appropriate event listeners on the document at destroy", () => {
    global.document.removeEventListener = jest.fn();

    const wrapper = shallowMount(LocationType, {
      localVue
    });

    wrapper.destroy();

    expect(document.removeEventListener).toHaveBeenCalledWith("click", wrapper.vm.onDocumentClick);
  });
});
