FROM node:16.13.2-alpine as builder

ARG DOCKER_ENV
ENV NODE_ENV=${DOCKER_ENV}
WORKDIR /app

ENV TZ="Europe/Moscow"

COPY ./.production.env ./.production.env
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
COPY ./dist ./dist
COPY ./node_modules ./node_modules

CMD ["npm", "run", "start:prod"]

