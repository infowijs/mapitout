![MapItOut logo](/docs/logo.png)

MapItOut is a tool to calculate how far you can travel with certain types of transport within Amsterdam and its surrounding cities/municipalities. It also shows POIs such as educational institutes.

![Screenshot of the application in a browser window](/docs/preview.png)


# Tech
## Backend
The backend consists out of several python scripts that serve as database wrappers, endpoint server and a proxy to the [Travel Time Platform's API](https://www.traveltimeplatform.com/).

The backend specific documentation can be found inside the `api` directory.

## Frontend
The front-end is a React application generated with the [Create React App](https://github.com/facebook/create-react-app) project. It uses Google Maps to display the map and some other self explanatory packages and methods in the app.

The frontend specific documentation can be found inside the `web` directory.
