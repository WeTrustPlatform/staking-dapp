#! /bin/bash

# This script builds and publish docker images.
# If tag is specified, it will create both docker and git tags.
#
# Usage: ./docker.sh mainnet|testnet [tagname]
# For example: ./docker.sh testnet v1.1.0
# will build the app for testnet
# and publish 1 image with 2 tags:
# sihoang/staking-dapp:testnet-latest
# sihoang/staking-dapp:testnet-v1.1.0
# it also creates `git tag <tagname>`
#
# To specify docker repo
# DOCKER_REPO="sihoang/staking-dapp" ./docker.sh

DOCKER_REPO=${DOCKER_REPO:-"wetrustplatform/staking-dapp"}
DOCKER_IMAGE="$DOCKER_REPO:$1-latest"

if [ "$1" == "testnet" -o "$1" == "mainnet" ]; then
  docker build \
    -t $DOCKER_IMAGE \
    -f Dockerfile.$1 \
    .
else
  echo "Please specify either testnet or mainnet!"
  exit 1
fi

echo ">> Pushing image $DOCKER_IMAGE to registry"
docker push $DOCKER_IMAGE

if [ -z "$2" ]; then
  echo ">> No tag specified"
  exit 0
else
  echo ">> Tag $2"
  git tag $2
  DOCKER_TAG="$DOCKER_REPO:$1-$2"
  docker tag $DOCKER_IMAGE $DOCKER_TAG
  echo ">> Pushing tag $DOCKER_TAG to registry"
  docker push $DOCKER_TAG
fi
