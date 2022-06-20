FROM node:16.13.2-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install -g
RUN npm install -g npm@8.12.2
RUN npm install

COPY . .

ARG DOCKER_ENV
ENV NODE_ENV=${DOCKER_ENV}

ENV TZ="Europe/Moscow"
CMD ["npm", "run", "start:production"]


