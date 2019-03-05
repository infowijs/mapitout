#!/usr/bin/env bash

set -x
set -e
set -u

cd /build

npm run lint
npm test
