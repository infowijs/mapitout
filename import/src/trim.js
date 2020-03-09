const fsPromises = require('fs').promises;
const argv = require('yargs').argv;

start();

async function start() {
  process.stdout.write('Starting the process\n\n');

  let addresses = [];

  try {
    const file = await fsPromises.readFile(__dirname + '/../export.json');
    addresses = JSON.parse(file);
  } catch (e) {
    process.stderr.write(`Couldn't load the file "${__dirname}/export.json"\n`);
  }


  const filteredAddresses = addresses
    .filter((address) => {
      if (address.lat === -1 || address.lng === -1) return false;
      if (!argv.lat || !argv.lng || !argv.radius) return true;

      const distance = getDistanceFromLatLonInKm(argv.lat, argv.lng, address.lat, address.lng);

      return distance <= argv.radius
    })
    .map((address) => {
      const {lat, lng, schools} = address;

      return {lat, lng, schools}
    });

  try {
    await fsPromises.writeFile(__dirname + '/../../web/src/assets/schools.json', JSON.stringify(filteredAddresses), 'utf8');
    process.stderr.write(`✔ Successfully stored the trimmed file in "${__dirname + '/../../web/src/assets/schools.json'}"\n`);
    process.stdout.write('Done!\n\n');
  } catch (e) {
    process.stderr.write(JSON.stringify(e));
  }
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2-lat1);  // deg2rad below
  const dLon = deg2rad(lon2-lon1);
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  ;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}
