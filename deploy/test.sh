#!/usr/bin/env bash

set -x
set -e
set -u

cd /build

yarn run lint
yarn test:unit
