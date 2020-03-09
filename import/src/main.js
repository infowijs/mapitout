const fs = require('fs').promises;
const argv = require('yargs').argv;
const csv = require('csvtojson');
const axios = require('axios');

start();

async function start () {
  let schools = [];
  process.stdout.write('Starting the process\n\n');

  for (const domain of ['primary', 'secondary', 'international']) {
    try {
      schools = schools.concat(
        (
          await csv({delimiter: 'auto'})
            .fromFile(argv[domain])
          || []
        )
        .map((v) => ({
          name: v['VESTIGINGSNAAM'] || v['INSTELLINGSNAAM'],
          url: v['INTERNETADRES'] || '',
          type: ['primary', 'secondary'].includes(domain) ? domain : v['TYPE'],
          international: domain === 'international',
          street: v['STRAATNAAM'],
          houseNumber: (v['HUISNUMMER-TOEVOEGING'] || '')
            .replace(' ', ''),
          postalCode: v['POSTCODE']
            .replace(' ', ''),
          city: v['PLAATSNAAM']
            .toUpperCase()
        }))
      );
      process.stderr.write(`✔ Successfully loaded "${argv[domain]}"\n`)
    } catch (e) {
      process.stderr.write(`Please provide a valid path to the ${domain} schools csv\n`)
    }
  }

  process.stderr.write(`\nDetected ${schools.length} schools\n`);
  process.stderr.write(`\t- ${schools.filter((v) => v.type === 'primary').length} primary schools\n`);
  process.stderr.write(`\t- ${schools.filter((v) => v.type === 'secondary').length} secondary schools\n`);
  process.stderr.write(`\t- ${schools.filter((v) => v.type === 'mixed').length} mixed schools\n`);
  process.stderr.write(`\t- ${schools.filter((v) => v.international).length} international schools\n`);

  const addresses = [];

  for (const school of schools) {
    const address = addresses.find((v) => (
      v.street === school.street
      && v.houseNumber === school.houseNumber
      && v.postalCode === school.postalCode
    ));
    const {name, url, type, international, street, houseNumber, postalCode, city} = school;

    if (address) {
      address.schools.push({name, url, type, international})
    } else {
      addresses.push({
        street,
        houseNumber,
        postalCode,
        city,
        lat: -1,
        lng: -1,
        schools: [{name, url, type, international}]
      })
    }
  }

  writeProgress(false, 0, addresses.length, 0);

  const errors = [];

  async function getAddress(i) {
    const address = addresses[i];

    const url = encodeURI(`https://nominatim.openstreetmap.org/search?street=${address.houseNumber} ${address.street}&postalcode=${address.postalCode}&city=${address.city}&format=json&addressdetails=1&limit=1`)
    const res = await axios.get(url);

    if (res && res.hasOwnProperty('data') && Array.isArray(res.data) && res.data.length > 0) {
      address.lat = parseFloat(res.data[0].lat);
      address.lng = parseFloat(res.data[0].lon);

      const addressData = res.data[0]['address'];

      address.houseNumber = addressData['house_number'] || address.houseNumber;
      address.street = addressData['road'] || address.street;
      address.city = addressData['city'] || addressData['town'] || address.city;
    } else {
      errors.push({address, url})
    }

    writeProgress(true, addresses.filter((v) => v.lat !== -1).length, addresses.length, errors.length);

    if ((i + 1) !== addresses.length) {
      setTimeout(() => getAddress(i + 1), 1000)
    } else {
      if (errors.length > 0) {
        await fs.writeFile(__dirname + '/../errors.json', JSON.stringify(errors), 'utf8');
      }
      await fs.writeFile(__dirname + '/../export.json', JSON.stringify(addresses), 'utf8');

      process.stdout.write('\nDone!\n');
    }
  }

  await getAddress(0);
}

function writeProgress(shouldRemove, completed, total, numberOfErrors) {
  if (shouldRemove) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
  }

  process.stderr.write(`${completed}/${total} addresses looked up – ${numberOfErrors} errors occurred`);
}
