export const COORDINATES_AMSTERDAM = { lat: 52, lng: -70.579 };

export function getNextMonday9Am() {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + ((1 + 7 - date.getUTCDay()) % 7));
  date.setUTCHours(9, 0, 0, 0);

  return date;
}

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
