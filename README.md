# MapItOut

MapitOut is a tool to calculate how far you can travel with certain types of transport within Amsterdam and its
surrounding cities/municipalities. It also shows POIs such as educational institutes.

---

**This is a public copy of the [MapitOut web application](https://mapitout.iamsterdam.com).**

This repository can be cloned and used by other parties, under the conditions of the GNU Lesser General Public License
3.0. The following conditions apply:

- Do not utilize the name MapItOut or the logo, or any of the related assets (branding, videos, FAQs, blog)
- Provide references to the original source material (this repository and URL), with the text: "Based on the open-source
  MapItOut application"

---

The current tech stack provides coverage within The Netherlands but contains some "bias" towards the Amsterdam region.
Such as the starting coordinates on launch, and the Google Places search targeted towards the Amsterdam region.

![Screenshot of the application in a browser window](/docs/preview.png)

## Getting started

This app uses a few services in order to run:

- [TravelTime Platform's Search](https://www.traveltimeplatform.com/search) API key
- [Google Maps](https://developers.google.com/maps/documentation/javascript/get-api-key) API key, this key needs to have
  access to the `geometry`, `drawing` and `places` features

Both API keys can be requested by following the guides provided by said provider (check the links).

## Tech stack

### Back-end

The only backend component to this application is a simple AWS Lambda (written in JavaScript) to proxy
the [Travel Time Platform's API](https://www.traveltimeplatform.com/). By proxying this request the API token can be
injected into the request and remain hidden from the user.

It is deployed via [Serverless](https://serverless.com/).

### Front-end

The frontend is a React application generated with the [Create React App](https://github.com/facebook/create-react-app)
project. It's written in [TypeScript](https://www.typescriptlang.org/), TypeScript is a typed superset of JavaScript
that compiles to plain JavaScript.

The frontend specific documentation can be found inside the `web` directory, nearly all the code is self explanatory
when your are familiar with React.

### Importer tool

The frontend requires a `schools.json` file (`src/assets/schools.json`) which contains the addresses of all
schools (depending on configuration), it can be generated using the import scripts and appropriate CSV files.

The generation of this file can be done using this command:

```shell
cd import && yarn start
```

The main script merges the data from three CSV files, geocodes the addresses and saves the data as a JSON file.

All three CSV files will be used to determine certain properties and must therefore adhere to certain standards, mainly
the column names and the fact that the application assumes all required fields to be filled in correctly. The naming
convention used in the process are based on the default column names as presented in the documents provided by DUO.

| column name                           | description                             | required in   |
| ------------------------------------- | --------------------------------------- | ------------- |
| `VESTIGINGSNAAM` or `INSTELLINGSNAAM` | title                                   | all           |
| `INTERNETADRES`                       | URL                                     | all           |
| `STRAATNAAM`                          | street                                  | all           |
| `HUISNUMMER-TOEVOEGING`               | house number                            | all           |
| `POSTCODE`                            | postal code                             | all           |
| `PLAATSNAAM`                          | city                                    | all           |
| `TYPE`                                | _"primary"_, _"secondary"_ or _"mixed"_ | international |
