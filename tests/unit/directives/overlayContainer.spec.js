import Vue from "vue";
import { mount, createLocalVue, shallowMount } from "@vue/test-utils";
import "../../../src/directives/overlayContainer";

const localVue = createLocalVue();

const TestComponent = Vue.component("test-component", {
  name: "test-component",
  template:
    "<div v-overlay-container='{togglePropName: \"testProp\"}'><a class='click-me-internal' /><input type='text' /> </div>",
  data: function() {
    return {
      testProp: false
    };
  }
});

const TestParentComponent = Vue.component("TestParentComponent", {
  components: { TestComponent },
  template: "<div><a class='click-me-external' /><test-component /></div>"
});

describe("v-overlay-container", () => {
  it("should maintain the prop to true whenever a click occurs inside the vNode element", () => {
    const parentWrapper = mount(TestParentComponent, {
      localVue,
      attachToDocument: true
    });

    const wrapper = parentWrapper.find(TestComponent);

    wrapper.vm.testProp = true;

    parentWrapper.find(".click-me-internal").trigger("click");

    expect(wrapper.vm.testProp).toBeTruthy();
  });

  it("should change the prop to false whenever a click occurs outside the vNode element", () => {
    const parentWrapper = mount(TestParentComponent, {
      localVue,
      attachToDocument: true
    });

    const wrapper = parentWrapper.find(TestComponent);

    wrapper.vm.testProp = true;

    parentWrapper.find(".click-me-external").trigger("click");

    expect(wrapper.vm.testProp).toBeFalsy();
  });

  it("should change the prop to false whenever the Esc key is pressed", () => {
    const wrapper = shallowMount(TestComponent, {
      localVue,
      attachToDocument: true
    });

    wrapper.vm.testProp = true;

    wrapper.find("input").trigger("keydown", {
      key: "Escape"
    });

    expect(wrapper.vm.testProp).toBeFalsy();
  });
});
