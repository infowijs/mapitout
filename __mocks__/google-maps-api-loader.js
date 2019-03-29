/* global jest */
const GoogleMapsApiLoader = jest.fn();
const Map = jest.fn();

GoogleMapsApiLoader.__simulateSuccess = () => {
  GoogleMapsApiLoader.mockResolvedValue({
    maps: { Map }
  });
};

GoogleMapsApiLoader.__simulateFailure = error => {
  GoogleMapsApiLoader.mockRejectedValue(error);
};

export { Map };

export default GoogleMapsApiLoader;
