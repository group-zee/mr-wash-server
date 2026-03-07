# Mr. Wash Backend Services

This repository contains the backend microservices for the **Mr. Wash** multi-city laundry aggregation platform.

## Architecture

The backend consists of several independent microservices communicating via an API Gateway and an Event Message Broker (RabbitMQ/Kafka). 
It employs a hybrid database strategy: MongoDB for adaptable schema data and PostgreSQL for strict transactional operations.

### Microservices List
- **api-gateway**: Routing, rate limiting, and centralized authentication validation.
- **auth-service**: User authentication, JWT issuance, and RBAC. (MongoDB)
- **user-service**: Customer, Provider, and Delivery profiles. (MongoDB)
- **laundry-service**: Provider management, services, and pricing. (MongoDB)
- **order-service**: Order lifecycle and management. (PostgreSQL)
- **delivery-service**: Delivery partner assignments and live tracking. (MongoDB)
- **payment-service**: Payments, commissions, and refunds. (PostgreSQL)
- **admin-service**: Admin dashboard and analytics APIs.

## Development Setup

### Prerequisites
- Docker & Docker Compose
- Node.js (v18+)
- Typescript strict mode is required across all services.

### Coding Standards
- **Commits**: Must follow conventional commits (`feat:`, `fix:`, `refactor:`, `docs:`).
- **Code Formatting**: Prettier and EditorConfig are strictly enforced.
- **Branching**: `main` is for production, `dev` is the primary integration branch. Feature branches should be branched from `dev` (`feature/*`).

## Running Locally
For local development, each service has its own `Dockerfile` and `docker-compose.yml` can be used to boot the entire cluster.
