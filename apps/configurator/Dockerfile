FROM node:22.13.0-alpine3.21 AS build
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build:configurator

FROM node:22.13.0-alpine3.21 AS runtime
WORKDIR /app
COPY --from=build /app/dist/apps/configurator ./dist/apps/configurator
COPY --from=build /app/node_modules ./node_modules
EXPOSE 3100
CMD [ "node", "dist/apps/configurator/main.js" ]
