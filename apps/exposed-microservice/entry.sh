#!/bin/sh

# Wait for configurator to communicate the api-key
sleep 3

# Create the directory for the api-key if it doesn't exist
if [ ! -d ".api-key" ]; then
  mkdir .api-key
fi

MAX_TRIES=10
ATTEMPT=0

# Check if the api-key is available
while [ $ATTEMPT -lt $MAX_TRIES ]; do
  if [ -f ".api-key/.env" ]; then
    echo "Lauching the app"
    # Source the api-key
    . .api-key/.env
    # Start the app
    exec node "./dist/apps/exposed-microservice/main.js"
    break
  else
    ATTEMPT=$((ATTEMPT+1))
    echo "Waiting for the api-key to be available"
    echo "Attempt $ATTEMPT of $MAX_TRIES"
    echo "Next attempt in 5 seconds"
    sleep 5
  fi
done

if [ $ATTEMPT -eq $MAX_TRIES ]; then
  echo "Failed to get the api-key"
  exit 1
fi