# Monorepo Microservices Setup with Docker Compose

## Overview

This project demonstrates a monorepo setup with multiple microservices using Docker Compose. The goal is to enable seamless integration and communication between the microservices while maintaining security and ease of deployment.

## Microservices

### Microservice 1: private-microservice

- This microservice won't be exposed to the internet.
- It provides APIs that other services can consume.
- When other services want to access the APIs they authenticated with an API key (which are generally limited in permissions).
- Only an admin user can generate an API key.

### Microservice 2: public-microservice

- This microservice is exposed to the internet.
- It needs to consume some APIs from Microservice 1.
- It requires an API key to access the APIs provided by Microservice 1.

## Problem Statement

To ensure secure communication between Microservice 2 and Microservice 1, we need to generate an API key. However, only an admin user can generate this API key. For security reasons, it is not a good idea to provide Microservice 2 with admin credentials.

## Solution

To address these challenges, we introduce an intermediate application, the `Configurator`, which has the admin credentials. The Configurator generates the API key and makes it available to Microservice 2 using a shared volume. This setup ensures that Microservice 2 can access the necessary APIs without compromising security.

## Why Not Add Initialization Logic in the Private Microservice Container?

Adding the initialization logic directly in the Private Microservice container might seem like a straightforward solution, but it introduces several issues:

1. **Separation of Concerns**: The Private Microservice's primary responsibility is to provide APIs for other services. Adding initialization logic for API key generation would mix concerns and complicate the service's codebase.

2. **Scalability**: If the initialization logic is part of the Private Microservice, scaling the service would also scale the initialization logic unnecessarily. This could lead to redundant API key generation and potential conflicts.

3. **Flexibility**: By using a separate Configurator service, we can easily modify or extend the initialization logic without affecting the Private Microservice. This modular approach makes the system more maintainable and adaptable to future changes.

4. **Deployment**: Separating the initialization logic into its own service allows for more granular control over the deployment process. We can ensure that the Configurator runs only when necessary, reducing resource usage and potential points of failure.

5. In some cases, we might be using an external image for the Private Microservice that we can't modify to implement the initialization as we want. Additionally, using a separate Configurator service allows us to write the initialization logic in languages we are comfortable with, rather than being forced to use something else like probably shell scripts 😊

For these reasons, it is more efficient and secure to handle the initialization logic in a dedicated Configurator service rather than embedding it within the Private Microservice container.

## Note

This setup is intended for demonstration purposes only. In a real-life scenario, you should implement more robust initialization logic, security measures, and error handling to ensure the reliability and security of your microservices architecture.

## Docker Compose Setup

The Docker Compose file is configured to orchestrate the deployment of all microservices and the Configurator. Here is an overview of the setup:

### Private Microservice

- Defined in the `docker-compose.yml` file.
- Uses a Dockerfile located at `./apps/private-microservice/Dockerfile`.
- Connected to the `internal-network`.

### Configurator

- Depends on the Private Microservice.
- Uses a Dockerfile located at `./apps/configurator/Dockerfile`.
- Sets environment variables for admin credentials and the URL of the Private Microservice.
- Shares the API key with Microservice 2 using a volume.
- Connected to the `internal-network`.

### Public Microservice

- Depends on both the Private Microservice and the Configurator.
- Uses a Dockerfile located at `./apps/exposed-microservice/Dockerfile`.
- Sets environment variables for the API key and the URL of the Private Microservice.
- Exposes port 3100 to the host.
- Shares the API key using a volume.
- Connected to the `internal-network`.

## Usage

To start all the services, simply run:

```sh
docker-compose up
```

Output:

```
private-microservice-1  | Listening on port 3000
public-microservice-1   | Waiting for the api-key to be available
public-microservice-1   | Attempt 1 of 10
public-microservice-1   | Next attempt in 5 seconds
configurator-1          | API key generated and saved
configurator-1 exited with code 0
public-microservice-1   | Lauching the app
public-microservice-1   | Listening on port 3100
public-microservice-1   | { message: 'API is accessible' }
```
