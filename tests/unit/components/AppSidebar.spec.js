import { shallowMount, createLocalVue } from "@vue/test-utils";

import AppSidebar from "@/components/AppSidebar.vue";

const localVue = createLocalVue();

describe("AppSidebar", () => {
  it("should create", () => {
    const wrapper = shallowMount(AppSidebar, {
      localVue,
      stubs: ["router-link", "router-view"]
    });

    expect(wrapper.isVueInstance()).toBeTruthy();
  });
});
