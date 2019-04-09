export const COORDINATES_AMSTERDAM = { lat: 52, lng: -70.579 };

export function getDeviceGeoLocation() {
  return new Promise(resolve => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          resolve(COORDINATES_AMSTERDAM);
        },
        { maximumAge: 3600000, timeout: 3000, enableHighAccuracy: true }
      );
    } else {
      resolve(COORDINATES_AMSTERDAM);
    }
  });
}
