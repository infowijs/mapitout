const axios = require("axios");

module.exports.handler = async (event) => {
  const headers = {
    "X-Application-Id": process.env.TRAVELTIME_APP_ID,
    "X-Api-Key": process.env.TRAVELTIME_APP_KEY,
    Accept: "application/json",
    "Content-type": "application/json",
  };

  const res = await axios.post(
    "https://api.traveltimeapp.com/v4/time-map",
    event.body,
    { headers }
  );

  return {
    statusCode: res.status,
    headers: {
      ...res.headers,
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": "true",
    },
    body: typeof res.data === "string" ? res.data : JSON.stringify(res.data),
  };
};
