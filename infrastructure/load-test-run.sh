#!/bin/bash

SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

docker run --rm -it -v $SCRIPTPATH:/app --network=host grafana/k6 run /app/load-test-config.js
