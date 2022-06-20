FROM node:16.13.2-alpine as builder
ARG DOCKER_ENV
ENV NODE_ENV build

WORKDIR /home/node

COPY package*.json ./
RUN npm ci

COPY --chown=node:node . .

RUN npm run build \
    && npm prune --production

FROM node:16.13.2-alpine

ARG DOCKER_ENV
ENV NODE_ENV=${DOCKER_ENV}
ENV TZ="Europe/Moscow"

WORKDIR /home/node

COPY --from=builder --chown=node:node /home/node/.production.env ./
COPY --from=builder --chown=node:node /home/node/package*.json ./
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/dist/ ./dist/

CMD ["node", "dist/server.js"]