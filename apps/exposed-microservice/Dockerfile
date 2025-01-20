FROM node:22.1.0 AS build
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build:exposed-microservice

FROM node:22.1.0 AS runtime
WORKDIR /app
COPY --from=build /app/dist/apps/exposed-microservice ./dist/apps/exposed-microservice
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/exposed-microservice/entry.sh ./entry.sh
RUN chmod +x ./entry.sh
CMD [ "/app/entry.sh" ]
