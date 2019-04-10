export const COORDINATES_AMSTERDAM = { lat: 52, lng: -70.579 };

export async function http(url, request) {
  let response;

  try {
    response = await fetch(url.toString(), request);
  } catch (error) {
    console.error(error);

    throw new Error("Unable to perform network call");
  }

  if (response.ok) {
    try {
      return await response.json();
    } catch (error) {
      console.error(error);

      throw new Error("Invalid server response");
    }
  } else {
    throw new Error("Invalid server response");
  }
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
