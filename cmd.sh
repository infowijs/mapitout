#!/bin/sh

set -e
set -u

echo "Converting %BASE_URL% to ${BASE_URL}" 
sed -i -e"s;%BASE_URL%;${BASE_URL};" /usr/share/nginx/html/index.html

echo "Starting Nginx"
exec nginx -g "daemon off;"
