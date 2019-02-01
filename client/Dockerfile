from node:10.15.1 as build-static-files

WORKDIR /app

ARG REACT_APP_CMS_URL=https://tcr.wetrust.info/api/v0
ARG REACT_APP_WEB3_FALLBACK_PROVIDER=https://rinkeby.infura.io/metamask
ARG REACT_APP_NETWORK_ID=4

COPY package.json yarn.lock ./

RUN yarn --production

COPY . .

RUN REACT_APP_NETWORK_ID=$REACT_APP_NETWORK_ID \
  REACT_APP_WEB3_FALLBACK_PROVIDER=$REACT_APP_WEB3_FALLBACK_PROVIDER \
  REACT_APP_CMS_URL=$REACT_APP_CMS_URL \
  yarn build

FROM nginx:1-alpine
COPY --from=build-static-files /app/build /usr/share/nginx/html

EXPOSE 80
