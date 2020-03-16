![MapItOut logo](/docs/logo.png)

MapItOut is a tool to calculate how far you can travel with certain types of transport within Amsterdam and its surrounding cities/municipalities. It also shows POIs such as educational institutes.
  
The current tech stack provides coverage within The Netherlands but contains some "bias" towards the Amsterdam region. Such as the starting coordinates on launch, and the Google Places search being targeted towards the Amsterdam region. 

![Screenshot of the application in a browser window](/docs/preview.png)

# Gettings started
This app uses a few services in order to run:
- [TravelTime Platform's Search](https://www.traveltimeplatform.com/search) API key
- [Google Maps](https://developers.google.com/maps/documentation/javascript/get-api-key) API key, this key needs to have access to the `geometry`, `drawing` and `places` features

Both API keys can be requested by following the guides provided by said provider (check the links).

## Tech

## Backend
The only backend component to this application is a simple AWS Lambda (written in JavaScript) to proxy the [Travel Time Platform's API](https://www.traveltimeplatform.com/). By proxying this request the API token can be injected into the request and remain hidden from the user.

It is deployed via [Serverless](https://serverless.com/).

## Frontend
The frontend is a React application generated with the [Create React App](https://github.com/facebook/create-react-app) project. It's written in [TypeScript](https://www.typescriptlang.org/), TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.

The frontend specific documentation can be found inside the `web` directory, nearly all the code is self explanatory when your are familiar with React.

# Import
The frontend requires a `schools.json` file (`web/src/assets/schools.json`) which contains the addresses of all schools (depending on configuration), it can be generated using the import scripts and appropriate CSV files.

The generation of this file is done as follows:
1. Entering the root directory of the scripts (`cd import`)
2. Running `node src/main.js --primary <path> --secondary <path> --international <path>`
3. Running `node src/trim.js`

The main script merges the data from three CSV files, geocodes the addresses and saves the data as a JSON file. The script requires thee arguments as described below.

| argument | description |
|-----|-----|
| primary | path to the primary schools file<sup>1</sup> |
| secondary | path to the secondary schools file<sup>2</sup> |
| international | path to the international schools file |

<sup>1</sup> Can be downloaded from the [DUO website (primary education)](https://duo.nl/open_onderwijsdata/databestanden/po/adressen/)  
<sup>2</sup> Can be downloaded from the [DUO website (secondary education)](https://duo.nl/open_onderwijsdata/databestanden/vo/adressen/)

All three CSV files will be used to determine certain properties and must therefor adhere to certain standards, mainly the column names and the fact that the application assumes all required fields to be filled in correctly. The naming convention used in the process are based on the default column names as presented in the documents provided by DUO.

| column name | description | required in |
|-----|-----|-----|
| `VESTIGINGSNAAM` or `INSTELLINGSNAAM` | title | all |
| `INTERNETADRES` | URL | all |
| `STRAATNAAM` | street | all |
| `HUISNUMMER-TOEVOEGING` | house number | all |
| `POSTCODE` | postal code | all |
| `PLAATSNAAM` | city | all |
| `TYPE` | _"primary"_, _"secondary"_ or _"mixed"_ | international |

The trim script removes invalid entries and is able to filter the previously generated JSON file based on distance from provided center coordinates. The arguments mentioned in the table below are optional, you can either use all off them, or none.

| argument | description |
|----|-----|
| lat | latitude of the center |
| lng | longitude of the center |
| radius | inclusion radius, provided in kilometers |
