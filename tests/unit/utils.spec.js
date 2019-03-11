import { COORDINATES_AMSTERDAM, getDeviceGeoLocation } from "../../src/utils";

describe("utils", () => {
  describe("getDeviceGeoLocation", async () => {
    it("should resolve to the coordinates provided by the geoLocation API when the geolocation API query is successful", async () => {
      const geoLocationResponse = { coords: { latitude: 53, longitude: -70.579 } };
      const expectedResponse = { lat: 53, lng: -70.579 };

      global.navigator.geolocation = {
        getCurrentPosition: jest.fn(callbackSuccess => callbackSuccess(geoLocationResponse))
      };

      const deviceGeoLocation = await getDeviceGeoLocation();

      expect(deviceGeoLocation).toEqual(expectedResponse);
    });

    it("should resolve to the Amsterdam coordinates when the geolocation API query is unsuccessful", async () => {
      const expectedResponse = COORDINATES_AMSTERDAM;

      global.navigator.geolocation = {
        getCurrentPosition: jest.fn((callbackSuccess, callbackFailure) => callbackFailure())
      };

      const deviceGeoLocation = await getDeviceGeoLocation();

      expect(deviceGeoLocation).toEqual(expectedResponse);
    });

    it("should resolve to the Amsterdam coordinates if geo-location is not supported by the device", async () => {
      delete global.navigator.geolocation;

      const deviceGeoLocation = await getDeviceGeoLocation();

      expect(deviceGeoLocation).toEqual(COORDINATES_AMSTERDAM);
    });
  });
});
