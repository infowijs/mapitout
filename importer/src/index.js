const fs = require("fs").promises;
const csv = require("csvtojson");
const axios = require("axios");
const get = require("async-get-file");
const pool = require("@ricokahler/pool");

start();

let cache;
const loadCache = async () => {
  if (cache) {
    return;
  }
  cache = {};
  try {
    cache = JSON.parse(await fs.readFile("input/address-cache.json", "utf8"));
    console.log(`\nLoaded ${Object.values(cache).length} addresses\n\n`);
  } catch (e) {}
};

const addressCache = async (address) => {
  const url = encodeURI(
    `https://nominatim.openstreetmap.org/search?street=${`${address.houseNumber} ${address.street}`.trim()}&postalcode=${
      address.postalCode
    }&city=${address.city}&format=json&addressdetails=1&limit=1`
  );

  if (cache[url]) {
    return cache[url];
  }

  const { data } = await axios.get(url);
  cache[url] = data;
  await fs.writeFile("input/address-cache.json", JSON.stringify(cache), "utf8");

  return data;
};

async function start() {
  let schools = [];
  process.stdout.write("Starting the process\n\n");

  try {
    fs.mkdirSync("input");
  } catch (e) {}

  await get(
    "https://duo.nl/open_onderwijsdata/images/03-alle-vestigingen-bo.csv",
    {
      directory: "./input",
      filename: "primary.csv",
    }
  );

  await get(
    "https://duo.nl/open_onderwijsdata/images/02-alle-vestigingen-vo.csv",
    {
      directory: "./input",
      filename: "secondary.csv",
    }
  );

  for (const domain of ["primary", "secondary", "international"]) {
    try {
      schools = schools.concat(
        (
          (await csv({ delimiter: "auto" }).fromFile(`input/${domain}.csv`)) ||
          []
        )
          // .filter(
          //   (v) =>
          //     !v.PROVINCIE ||
          //     v.PROVINCIE.includes("Holland") ||
          //     v.PROVINCIE.includes("Utrecht") ||
          //     v.PROVINCIE.includes("Flevoland")
          // )
          .map((v) => ({
            name: v["VESTIGINGSNAAM"] || v["INSTELLINGSNAAM"],
            url: v["INTERNETADRES"] || "",
            type: ["primary", "secondary"].includes(domain)
              ? domain
              : v["TYPE"] === "primary,secondary"
              ? "mixed"
              : v["TYPE"],
            international: domain === "international",
            street: v["STRAATNAAM"],
            houseNumber: (v["HUISNUMMER-TOEVOEGING"] || "").replace(" ", ""),
            postalCode: v["POSTCODE"].replace(" ", ""),
            city: v["PLAATSNAAM"].toUpperCase(),
          }))
      );
      process.stderr.write(`✔ Successfully loaded "input/${domain}.csv"\n`);
    } catch (e) {
      process.stderr.write(
        `Please provide a valid path to the ${domain} schools csv\n`
      );
    }
  }

  process.stderr.write(`\nDetected ${schools.length} schools\n`);
  process.stderr.write(
    `\t- ${
      schools.filter((v) => v.type === "primary").length
    } primary schools\n`
  );
  process.stderr.write(
    `\t- ${
      schools.filter((v) => v.type === "secondary").length
    } secondary schools\n`
  );
  process.stderr.write(
    `\t- ${schools.filter((v) => v.type === "mixed").length} mixed schools\n`
  );
  process.stderr.write(
    `\t- ${
      schools.filter((v) => v.international).length
    } international schools\n`
  );

  const addresses = [];

  for (const school of schools) {
    const address = addresses.find(
      (v) =>
        v.street === school.street &&
        v.houseNumber === school.houseNumber &&
        v.postalCode === school.postalCode
    );
    const {
      name,
      url,
      type,
      international,
      street,
      houseNumber,
      postalCode,
      city,
    } = school;

    if (address) {
      address.schools.push({ name, url, type, international });
    } else {
      addresses.push({
        street,
        houseNumber,
        postalCode,
        city,
        lat: -1,
        lng: -1,
        schools: [{ name, url, type, international }],
      });
    }
  }

  const errors = [];

  await loadCache();

  writeProgress(false, 0, addresses.length, 0);

  const res = await pool({
    collection: addresses,
    maxConcurrency: 3,
    task: async (address) => {
      const data = await addressCache(address);

      if (data && Array.isArray(data) && data.length > 0) {
        address.lat = parseFloat(data[0].lat);
        address.lng = parseFloat(data[0].lon);

        const addressData = data[0]["address"];

        address.houseNumber =
          addressData["house_number"] || address.houseNumber;
        address.street = addressData["road"] || address.street;
        address.city =
          addressData["city"] || addressData["town"] || address.city;
      } else {
        errors.push({ address });
      }

      writeProgress(
        true,
        addresses.filter((v) => v.lat !== -1).length,
        addresses.length,
        errors.length
      );

      return address;
    },
  });

  if (errors.length > 0) {
    await fs.writeFile(
      __dirname + "/../input/errors.json",
      JSON.stringify(errors),
      "utf8"
    );
  }

  process.stdout.write("\nDone!\n");

  await postprocess(res);
}

function writeProgress(shouldRemove, completed, total, numberOfErrors) {
  if (shouldRemove) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
  }

  process.stderr.write(
    `${completed}/${total} addresses looked up – ${numberOfErrors} errors occurred`
  );
}

async function postprocess(addresses) {
  process.stdout.write("Starting the post-process\n\n");

  const filteredAddresses = addresses
    .filter((address) => {
      if (address.lat === -1 || address.lng === -1) return false;

      const distance = getDistanceFromLatLonInKm(
        52.3676,
        4.9041, // centre of Amsterdam
        address.lat,
        address.lng
      );

      return distance <= 100; // anything within 100 km
    })
    .map((address) => {
      const { lat, lng, schools } = address;

      return { lat, lng, schools };
    });

  console.log(
    `Filtered down from ${addresses.length} to ${filteredAddresses.length} relevant addresses.`
  );

  await fs.writeFile(
    __dirname + "/../../src/assets/schools.json",
    JSON.stringify(filteredAddresses),
    "utf8"
  );
  console.log(
    `✔ Successfully stored the trimmed file in "${
      __dirname + "/../../src/assets/schools.json"
    }"\n`
  );
  console.log("Done!\n\n");
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  // Distance in km
  return R * c;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
