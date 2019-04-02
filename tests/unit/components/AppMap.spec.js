import { shallowMount, createLocalVue } from "@vue/test-utils";
import flushPromises from "flush-promises";
import GoogleMapsApiLoader, { Map } from "google-maps-api-loader";
import { getDeviceGeoLocation } from "../../../src/utils";

import AppMap, { BOUNDARIES_NETHERLANDS } from "@/components/AppMap.vue";
import styles from "../../../src/style/google-maps";
import Vuex from "vuex";

jest.mock("google-maps-api-loader");
jest.mock("../../../src/utils");

const localVue = createLocalVue();
localVue.use(Vuex);

xdescribe("AppMap", () => {
  const routerMock = { push: jest.fn() };
  const activateRangeSpy = jest.fn();
  const getLocationTypeByValueSpy = jest.fn();
  const rangesWithOriginSpy = jest.fn();

  let store = new Vuex.Store({
    modules: {
      locations: {
        namespaced: true,
        getters: {
          getLocationTypeByValue: getLocationTypeByValueSpy
        }
      },
      ranges: {
        namespaced: true,
        state: {
          activeId: undefined
        },
        actions: {
          activate: activateRangeSpy
        },
        getters: {
          rangesWithOrigin: rangesWithOriginSpy
        }
      },
      areas: {
        namespaced: true,
        state: {
          areas: [],
          mapBoundaries: {}
        }
      }
    }
  });
  let wrapper;

  beforeEach(() => {
    GoogleMapsApiLoader.__simulateSuccess();

    jest.resetAllMocks();

    wrapper = shallowMount(AppMap, {
      localVue,
      store,
      mocks: {
        $router: routerMock
      }
    });
  });

  it("should create", () => {
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it("should instantiate the Google Maps API on mount ", async () => {
    await flushPromises();

    expect(GoogleMapsApiLoader).toHaveBeenCalledWith({
      apiKey: process.env.VUE_APP_GOOGLE_API_KEY
    });
  });

  it("should create a Google Maps instance on successful API load ", async () => {
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
    const error = new Error("Big bad error");
    GoogleMapsApiLoader.__simulateFailure(error);

    await flushPromises();

    expect(routerMock.push).toHaveBeenCalledWith({ name: "error", params: { error } });
  });
});
