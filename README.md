![MapItOut logo](/docs/logo.png)

MapItOut is a tool to calculate how far you can travel with certain types of transport within Amsterdam and its surrounding cities/municipalities. It also shows POIs such as educational institutes.

![Screenshot of the application in a browser window](/docs/preview.png)


# Tech
## Backend
The only backend component to this application is a simple AWS Lambda (written in JavaScript) to proxy the [Travel Time Platform's API](https://www.traveltimeplatform.com/).

It is deployed via [Serverless](https://serverless.com/).

## Frontend
The front-end is a React application generated with the [Create React App](https://github.com/facebook/create-react-app) project. It uses Google Maps to display the map and some other self explanatory packages and methods in the app.

The frontend specific documentation can be found inside the `web` directory.
