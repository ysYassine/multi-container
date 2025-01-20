FROM node:22.1.0 AS build
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build:private-microservice

FROM node:22.1.0 AS runtime
WORKDIR /app
COPY --from=build /app/dist/apps/private-microservice ./dist/apps/private-microservice
COPY --from=build /app/node_modules ./node_modules
EXPOSE 3000

CMD [ "node", "dist/apps/private-microservice/main.js" ]
