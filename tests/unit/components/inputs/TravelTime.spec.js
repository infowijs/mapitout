import { shallowMount, createLocalVue } from "@vue/test-utils";

import TravelTime from "@/components/input/TravelTime.vue";

const localVue = createLocalVue();

describe("TravelTime", () => {
  it("should create", () => {
    const wrapper = shallowMount(TravelTime, {
      localVue
    });

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it("should change its value whenever clicking somewhere on the rail", () => {
    const wrapper = shallowMount(TravelTime, {
      localVue,
      attachToDocument: true
    });

    wrapper.find(".rail").trigger("click", { offsetX: 100 });

    expect(wrapper.emitted("input")).toBeTruthy();
  });

  it("should correctly update its data object whenever the panstart event is triggered", () => {
    const wrapper = shallowMount(TravelTime, {
      localVue,
      attachToDocument: true
    });

    wrapper.vm.onHandlePanStart();

    expect(wrapper.vm.initialOffset).toBeDefined();
    expect(wrapper.vm.minOffset).toBeDefined();
    expect(wrapper.vm.maxOffset).toBeDefined();
  });

  it("should update the handle style if the newOffset is within bounds", () => {
    const wrapper = shallowMount(TravelTime, {
      localVue,
      attachToDocument: true
    });

    const initialOffset = 50;
    const deltaX = 80;

    wrapper.setData({ minOffset: -6, maxOffset: 150, initialOffset });

    wrapper.vm.onHandlePan({ deltaX });

    expect(wrapper.find(".handle").element.style.left).toBe(`${deltaX + initialOffset}px`);
  });

  it("should should not allow a slide beyond the maxValue", () => {
    const wrapper = shallowMount(TravelTime, {
      localVue,
      attachToDocument: true
    });

    const initialOffset = 50;
    const deltaX = 180;

    wrapper.setData({ minOffset: -6, maxOffset: 150, initialOffset });

    wrapper.vm.onHandlePan({ deltaX });

    expect(wrapper.find(".handle").element.style.left).toBe("150px");
  });

  it("should should not allow a slide beyond the minValue", () => {
    const wrapper = shallowMount(TravelTime, {
      localVue,
      attachToDocument: true
    });

    const initialOffset = 50;
    const deltaX = -180;

    wrapper.setData({ minOffset: -6, maxOffset: 150, initialOffset });

    wrapper.vm.onHandlePan({ deltaX });

    expect(wrapper.find(".handle").element.style.left).toBe("-6px");
  });

  it("should update its value on pan end", () => {
    const wrapper = shallowMount(TravelTime, {
      localVue,
      attachToDocument: true
    });

    wrapper.vm.onHandlePanEnd();

    expect(wrapper.emitted("input")).toBeTruthy();
  });
});
