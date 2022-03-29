FROM node:16.13.2-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install -g

COPY . .

ARG DOCKER_ENV
ENV NODE_ENV=${DOCKER_ENV}

ENV TZ="Europe/Moscow"
CMD ["npm", "run", "start:production"]


