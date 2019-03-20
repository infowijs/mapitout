import { shallowMount, createLocalVue } from "@vue/test-utils";

import Icon from "@/components/Icon.vue";

const localVue = createLocalVue();

describe("Icon", () => {
  it("should create", () => {
    const wrapper = shallowMount(Icon, {
      localVue,
      propsData: {
        name: "bicycle"
      }
    });

    expect(wrapper.isVueInstance()).toBeTruthy();
  });
});
