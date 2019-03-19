import Vue from "vue";
import { createLocalVue, shallowMount } from "@vue/test-utils";
import "../../../src/directives/navigableContainer";

const localVue = createLocalVue();

const TestComponent = Vue.component("test-component", {
  name: "test-component",
  data: function() {
    return {
      cursor: -1
    };
  },
  template:
    '<div v-navigable-container="{\n' +
    "      cursorPropName: 'cursor'\n" +
    '    }"><div></div><ul><li></li><li></li><li></li><li></li></ul></div>'
});

describe("v-overlay-container", () => {
  it("should add the focused class to li elements being hoverd over and update the focused index", () => {
    const wrapper = shallowMount(TestComponent, {
      localVue,
      attachToDocument: true
    });
    const listItemWrappers = wrapper.findAll("li");

    listItemWrappers.at(2).trigger("mouseover");

    expect(wrapper.vm.cursor).toBe(2);

    listItemWrappers.at(3).trigger("mouseover");
    expect(wrapper.vm.cursor).toBe(3);
  });

  it("should reset the focused index prop and remove all focused classes when mouse hovering outiside the list", () => {
    const wrapper = shallowMount(TestComponent, {
      localVue,
      attachToDocument: true
    });
    const listItemWrappers = wrapper.findAll("li");

    listItemWrappers.at(2).trigger("mouseover");

    expect(wrapper.vm.cursor).toBe(2);

    wrapper.find("div").trigger("mouseover");

    expect(wrapper.vm.cursor).toBe(-1);
  });

  it("should move the cursor down whenever pressing the down arrow key", () => {
    const wrapper = shallowMount(TestComponent, {
      localVue,
      attachToDocument: true
    });

    wrapper.vm.cursor = 1;

    wrapper.trigger("keydown", {
      key: "ArrowDown"
    });
    expect(wrapper.vm.cursor).toBe(2);

    wrapper.trigger("keydown", {
      key: "ArrowDown"
    });
    expect(wrapper.vm.cursor).toBe(3);

    wrapper.trigger("keydown", {
      key: "ArrowDown"
    });
    expect(wrapper.vm.cursor).toBe(3);
  });

  it("should move the cursor up whenever pressing the up arrow key", () => {
    const wrapper = shallowMount(TestComponent, {
      localVue,
      attachToDocument: true
    });

    wrapper.vm.cursor = 2;

    wrapper.trigger("keydown", {
      key: "ArrowUp"
    });
    expect(wrapper.vm.cursor).toBe(1);

    wrapper.trigger("keydown", {
      key: "ArrowUp"
    });
    expect(wrapper.vm.cursor).toBe(0);

    wrapper.trigger("keydown", {
      key: "ArrowUp"
    });
    expect(wrapper.vm.cursor).toBe(0);
  });
});
