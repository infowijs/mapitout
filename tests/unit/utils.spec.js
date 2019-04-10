import { COORDINATES_AMSTERDAM, getDeviceGeoLocation, http } from "../../src/utils";

describe("utils", () => {
  describe("http", () => {
    global.fetch = jest.fn();
    global.console = {
      error: jest.fn()
    };

    beforeEach(() => {
      jest.resetAllMocks();
    });

    it("should call fetch with the passed in url and request object", async () => {
      const request = { method: "GET" };
      const url = new URL("http://localhost");

      fetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({})
      });

      await http(url, request);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(url.toString(), request);
    });

    it("should throw an error on a failed fetch call", async () => {
      const request = { method: "GET" };
      const url = new URL("http://localhost");

      fetch.mockRejectedValue(new Error());

      await expect(http(url, request)).rejects.toThrowError(
        new Error("Unable to perform network call")
      );
    });

    it("should return the result on a successful fetch call with a valid response", async () => {
      const request = { method: "GET" };
      const url = new URL("http://localhost");
      const expectedResult = { resolved: true };

      fetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(expectedResult)
      });

      const result = await http(url, request);

      expect(result).toEqual(expectedResult);
    });

    it("should throw an error on an invalid fetch response json", async () => {
      const request = { method: "GET" };
      const url = new URL("http://localhost");

      fetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockRejectedValue(new Error())
      });

      await expect(http(url, request)).rejects.toThrowError("Invalid server response");
    });

    it("should throw an error on an invalid fetch response", async () => {
      const request = { method: "GET" };
      const url = new URL("http://localhost");

      fetch.mockResolvedValue({
        ok: false
      });

      await expect(http(url, request)).rejects.toThrowError("Invalid server response");
    });
  });
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
