# DEVELOPMENT LAYER

FROM node:18-alpine As development

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node:node . .

USER node

# BUILD LAYER

FROM node:18-alpine As build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

RUN npm run build

ENV NODE_ENV production

RUN npm ci --only=production && npm cache clean --force

USER node

# PRODUCTION LAYER

FROM node:18-alpine As production

LABEL maintainer="aivironcom@gmail.com" version="1.0"

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules

COPY --chown=node:node --from=build /usr/src/app/dist ./dist

EXPOSE 5000

ENV PGHOST=pgdb.xxxxxxxxxxxx.eu-north-1.rds.amazonaws.com PGPORT=5432 PGDATABASE=rss PGUSER=testuser PGPASSWORD=testpass

CMD [ "node", "dist/main.js" ]
