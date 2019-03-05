# Build
FROM node:latest as build-deps
MAINTAINER datapunt.ois@amsterdam.nl

COPY package*.json /build/
WORKDIR /build
RUN npm install && npm cache clean --force
COPY . /build/
RUN npm run build

# webserver image.
FROM nginx:latest
MAINTAINER datapunt.ois@amsterdam.nl

ENV BASE_URL=https://api.data.amsterdam.nl/
COPY cmd.sh /usr/local/bin/
RUN chmod 755 /usr/local/bin/cmd.sh

COPY public/ /usr/share/nginx/html/
COPY --from=build-deps /build/dist/ /usr/share/nginx/html/
CMD cmd.sh
