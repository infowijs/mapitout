import { shallowMount, createLocalVue } from "@vue/test-utils";
import flushPromises from "flush-promises";
import GoogleMapsApiLoader, { Map } from "google-maps-api-loader";
import { getDeviceGeoLocation } from "../../../src/utils";

import AppMap, { BOUNDARIES_NETHERLANDS } from "@/components/AppMap.vue";
import styles from "../../../src/style/google-maps";

jest.mock("google-maps-api-loader");
jest.mock("../../../src/utils");

const localVue = createLocalVue();

describe("AppMap", () => {
  beforeEach(() => {
    GoogleMapsApiLoader.__simulateSuccess();
    jest.clearAllMocks();
  });

  it("should create", () => {
    const wrapper = shallowMount(AppMap, {
      localVue
    });

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it("should instantiate the Google Maps API on mount ", async () => {
    shallowMount(AppMap, {
      localVue
    });

    await flushPromises();

    expect(GoogleMapsApiLoader).toHaveBeenCalledWith({
      apiKey: process.env.VUE_APP_GOOGLE_API_KEY
    });
  });

  it("should create a Google Maps instance on successful API load ", async () => {
    const wrapper = shallowMount(AppMap, {
      localVue
    });

    const deviceGeoLocation = { lat: 52, lng: -70.579 };

    getDeviceGeoLocation.mockResolvedValue(deviceGeoLocation);

    await flushPromises();

    expect(Map).toHaveBeenCalledWith(wrapper.vm.$refs.map, {
      disableDefaultUI: true,
      zoom: 9,
      minZoom: 9,
      center: deviceGeoLocation,
      restriction: {
        latLngBounds: BOUNDARIES_NETHERLANDS
      },
      styles
    });
  });

  it("should redirect to an error page on an unsuccessful Google Maps API load", async () => {
    const $router = {
      push: jest.fn()
    };
    const error = new Error("Big bad error");
    GoogleMapsApiLoader.__simulateFailure(error);

    shallowMount(AppMap, {
      localVue,
      mocks: { $router }
    });

    await flushPromises();

    expect($router.push).toHaveBeenCalledWith({ name: "error", params: { error } });
  });
});
