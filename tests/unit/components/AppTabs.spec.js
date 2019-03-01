import { shallowMount, createLocalVue } from "@vue/test-utils";

import AppTabs from "@/components/AppTabs.vue";

const localVue = createLocalVue();

describe("AppTabs", () => {
  it("should create", () => {
    const wrapper = shallowMount(AppTabs, {
      localVue
    });

    expect(wrapper.isVueInstance()).toBeTruthy();
  });
});
