import { shallowMount, createLocalVue } from "@vue/test-utils";

import AppSidebar from "@/components/AppSidebar.vue";

const localVue = createLocalVue();

describe("AppSidebar", () => {
  it("should create", () => {
    const wrapper = shallowMount(AppSidebar, {
      localVue
    });

    expect(wrapper.isVueInstance()).toBeTruthy();
  });
});
