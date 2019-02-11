#! /bin/bash

# This script builds and publish docker images

DOCKER_REPO="sihoang/staking-dapp"
DOCKER_IMAGE="$DOCKER_REPO:$1-latest"

if [ "$1" == "testnet" ]; then
  docker build \
    -t $DOCKER_IMAGE \
    .
elif [ "$1" == "mainnet" ]; then
  docker build \
    -t $DOCKER_IMAGE \
    --build-arg REACT_APP_NETWORK_ID=1 \
    --build-arg REACT_APP_WEB3_FALLBACK_PROVIDER=https://mainnet.infura.io/metamask \
    .
else
  echo "Please specify either testnet or mainnet!"
  exit 1
fi

echo ">> Pushing to docker registry"
docker push $DOCKER_IMAGE
