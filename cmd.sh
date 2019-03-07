#!/bin/sh

set -e
set -u

echo "Starting Nginx"
exec nginx -g "daemon off;"
