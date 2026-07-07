# Tamper-Evident Append-Only Log Service

A production-ready REST API built with **Node.js**, **Express.js**, **PostgreSQL**, and **Prisma ORM** that provides a **tamper-evident append-only logging system**. Every log entry is cryptographically linked to the previous entry using **SHA-256 hashing**, creating an immutable hash chain that allows anyone to verify the integrity of the entire log history.

This project follows **Clean Architecture**, implements secure API practices, supports Docker deployment, includes comprehensive testing, and provides interactive API documentation using Swagger.

---

# Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Database Schema](#database-schema)
- [Hash Chain](#hash-chain)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [Running with Docker](#running-with-docker)
- [Swagger Documentation](#swagger-documentation)
- [CLI Verification](#cli-verification)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Security Features](#security-features)
- [Logging](#logging)
- [Future Improvements](#future-improvements)
- [AI Usage Log](#ai-usage-log)
- [License](#license)

---

# Overview

Traditional logging systems allow records to be edited or deleted, making them unsuitable for security-critical applications such as:

- Audit logging
- Financial transactions
- Compliance systems
- Healthcare systems
- Government records
- Digital forensics

This project solves that problem by implementing an **append-only log service** where:

- Records are never updated
- Records are never deleted
- Every log references the previous log's hash
- Any modification immediately breaks the chain
- Entire history can be verified at any time

---

# Features

## Core Features

- Append-only log storage
- SHA-256 cryptographic hash chain
- Genesis block support
- Full chain verification
- Individual log verification
- JSON payload support

## API Features

- Create Log
- Retrieve Log
- Verify Entire Chain
- Export Logs
- Pagination
- Date Filtering
- Actor Filtering

## Security

- API Key Authentication
- Helmet
- CORS
- Rate Limiting
- Input Validation (Zod)
- Centralized Error Handling

## Production Features

- Prisma ORM
- PostgreSQL
- Docker
- Docker Compose
- Structured Logging (Pino)
- Swagger Documentation
- CLI Verification Tool
- Unit Tests
- Integration Tests
- Health Endpoint

---

# Architecture

The project follows a layered Clean Architecture.

```
                Client

                  │

                  ▼

             Express Routes

                  │

                  ▼

             Controllers

                  │

                  ▼

               Services

                  │

                  ▼

            Repositories

                  │

                  ▼

             Prisma ORM

                  │

                  ▼

             PostgreSQL
```

## Layer Responsibilities

### Routes

- Define API endpoints
- Apply middleware
- Forward requests to controllers

### Controllers

- Handle HTTP requests
- Call service layer
- Return HTTP responses

### Services

- Business logic
- Hash generation
- Chain verification

### Repository

- Database interaction
- Prisma queries

### Utils

- SHA-256 hashing
- Helper functions

### Middleware

- Authentication
- Validation
- Rate limiting
- Error handling

---

# Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express.js | REST API |
| PostgreSQL | Database |
| Prisma ORM | Database Access |
| SHA-256 (Node Crypto) | Cryptographic Hashing |
| Pino | Structured Logging |
| Zod | Validation |
| Helmet | Security Headers |
| CORS | Cross-Origin Requests |
| Express Rate Limit | Rate Limiting |
| Docker | Containerization |
| Docker Compose | Multi-container Deployment |
| Swagger UI | API Documentation |
| Jest | Unit Testing |
| Supertest | API Testing |

---

# Folder Structure

```
tamper-evident-log-service/

├── prisma/
│   ├── migrations/
│   └── schema.prisma
│
├── scripts/
│   └── verify.js
│
├── src/
│
│   ├── config/
│   │   ├── env.js
│   │   ├── logger.js
│   │   └── prisma.js
│   │
│   ├── controllers/
│   │   └── logController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── rateLimiter.js
│   │   └── validate.js
│   │
│   ├── repositories/
│   │   └── logRepository.js
│   │
│   ├── routes/
│   │   └── logRoutes.js
│   │
│   ├── services/
│   │   └── logService.js
│   │
│   ├── utils/
│   │   ├── hash.js
│   │   └── AppError.js
│   │
│   ├── validators/
│   │   └── logValidator.js
│   │
│   ├── docs/
│   │   └── openapi.yaml
│   │
│   ├── app.js
│   └── server.js
│
├── tests/
│   ├── integration/
│   ├── unit/
│   └── setup.js
│
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md
```

---

# Database Schema

## LogEntry

| Column | Type |
|---------|------|
| id | Integer |
| actor | String |
| action | String |
| payload | JSON |
| previousHash | String |
| currentHash | String |
| createdAt | DateTime |

Rules:

- No UPDATE
- No DELETE
- Only INSERT

---

# Hash Chain

Each log stores the hash of the previous log.

First log

```
previousHash = GENESIS
```

Current hash is generated using:

```
SHA256(

previousHash +
actor +
action +
payload +
createdAt

)
```

Example

```
GENESIS

↓

Entry 1

Hash = 8A4F...

↓

Entry 2

Previous = 8A4F...

Hash = 9C72...

↓

Entry 3

Previous = 9C72...

Hash = 71BC...
```

If even one character changes, every subsequent hash becomes invalid.

---

# API Endpoints

## Create Log

```
POST /log
```

Request

```json
{
  "actor": "Alice",
  "action": "LOGIN",
  "payload": {}
}
```

Response

```json
{
  "id": 1,
  "hash": "e56d8d..."
}
```

---

## Get Log

```
GET /log/:id
```

Returns

- Log Entry
- Verification Status

---

## Verify Chain

```
GET /log/verify
```

Success

```json
{
  "pass": true,
  "brokenEntryId": null
}
```

Failure

```json
{
  "pass": false,
  "brokenEntryId": 12
}
```

---

## Export Logs

```
GET /log/export
```

Supports

- actor
- from
- to
- page
- limit

Example

```
GET /log/export?actor=Alice&page=1&limit=20
```

---

## Health Check

```
GET /health
```

---

# Authentication

Every protected endpoint requires:

```
x-api-key
```

Example

```
x-api-key: super-secret-api-key
```

Unauthorized requests return

```
401 Unauthorized
```

---

# Environment Variables

Create a `.env` file.

```
PORT=3000

NODE_ENV=development

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/tamperlog?schema=public

API_KEY=super-secret-api-key
```

---

# Running Locally

## Install Dependencies

```bash
npm install
```

## Generate Prisma Client

```bash
npx prisma generate
```

## Run Migrations

```bash
npx prisma migrate dev
```

## Start Development Server

```bash
npm run dev
```

---

# Running with Docker

Build and start services

```bash
docker compose up --build
```

This starts

- PostgreSQL
- API Server

Migrations are automatically applied.

---



# API Testing with CURL

> Replace `super-secret-api-key` with your actual API key.

## Health Check

```bash
curl http://localhost:3000/health
```

---

## Create Log

```bash
curl -X POST http://localhost:3000/log \
-H "Content-Type: application/json" \
-H "x-api-key: super-secret-api-key" \
-d '{
  "actor":"Alice",
  "action":"LOGIN",
  "payload":{}
}'
```

---

## Create Second Log

```bash
curl -X POST http://localhost:3000/log \
-H "Content-Type: application/json" \
-H "x-api-key: super-secret-api-key" \
-d '{
  "actor":"Bob",
  "action":"UPLOAD",
  "payload":{
    "file":"report.pdf"
  }
}'
```

---

## Create Third Log

```bash
curl -X POST http://localhost:3000/log \
-H "Content-Type: application/json" \
-H "x-api-key: super-secret-api-key" \
-d '{
  "actor":"Charlie",
  "action":"DELETE",
  "payload":{
    "file":"old.pdf"
  }
}'
```

---

## Get Log by ID

```bash
curl http://localhost:3000/log/1 \
-H "x-api-key: super-secret-api-key"
```

---

## Verify Chain

```bash
curl http://localhost:3000/log/verify \
-H "x-api-key: super-secret-api-key"
```

---

## Export All Logs

```bash
curl http://localhost:3000/log/export \
-H "x-api-key: super-secret-api-key"
```

---

## Export Logs by Actor

```bash
curl "http://localhost:3000/log/export?actor=Alice" \
-H "x-api-key: super-secret-api-key"
```

---

## Export Logs by Date Range

```bash
curl "http://localhost:3000/log/export?from=2026-01-01&to=2026-12-31" \
-H "x-api-key: super-secret-api-key"
```

---

## Export Logs with Pagination

```bash
curl "http://localhost:3000/log/export?page=1&limit=5" \
-H "x-api-key: super-secret-api-key"
```

---

## Export Logs by Actor with Pagination

```bash
curl "http://localhost:3000/log/export?actor=Alice&page=1&limit=5" \
-H "x-api-key: super-secret-api-key"
```

---

## Export Logs by Actor and Date Range

```bash
curl "http://localhost:3000/log/export?actor=Alice&from=2026-01-01&to=2026-12-31" \
-H "x-api-key: super-secret-api-key"
```

---

## Missing API Key

```bash
curl http://localhost:3000/log/1
```

---

## Invalid API Key

```bash
curl http://localhost:3000/log/1 \
-H "x-api-key: wrong-key"
```

---

## Validation Error

```bash
curl -X POST http://localhost:3000/log \
-H "Content-Type: application/json" \
-H "x-api-key: super-secret-api-key" \
-d '{
  "actor":"",
  "action":"LOGIN",
  "payload":{}
}'
```

---

## Unknown Route

```bash
curl http://localhost:3000/unknown
```

---

## Swagger Documentation

```bash
curl http://localhost:3000/docs
```

---

## Rate Limiting Test (11 Requests)

```bash
for i in {1..11}
do
curl -X POST http://localhost:3000/log \
-H "Content-Type: application/json" \
-H "x-api-key: super-secret-api-key" \
-d '{
  "actor":"RateTest",
  "action":"LOGIN",
  "payload":{}
}'
echo
done
```

# Swagger Documentation

After starting the server, open:

```
http://localhost:3000/docs
```

Swagger provides

- Interactive API Explorer
- Request examples
- Response schemas

---

# CLI Verification

Verify the complete log chain.

```bash
npm run verify
```

Example

```
====================================
 Tamper-Evident Log Verification
====================================

Status        : PASS
Total Entries : 52

✔ Chain integrity verified.
```

On failure

```
Status        : FAIL

Broken Entry  : 17
```

Exit Codes

- 0 → Success
- 1 → Failure

---

# Testing

Run all tests

```bash
npm test
```

Tests include

- Hash generation
- Chain verification
- Authentication
- Rate limiting
- Log creation
- Export endpoint
- Health endpoint

---

# Project Structure

```
Client

↓

Routes

↓

Controllers

↓

Services

↓

Repositories

↓

Prisma

↓

PostgreSQL
```

Business logic exists only inside the Service layer.

---

# Security Features

- API Key Authentication
- Helmet
- CORS
- Rate Limiting
- Input Validation
- Centralized Error Handling
- Parameterized Queries (Prisma)
- Environment Variable Management
- No Hardcoded Secrets

---

# Logging

Structured logging is implemented using **Pino**.

The application logs:

- Incoming requests
- Authentication failures
- Rate limit violations
- Database operations
- Verification runs
- Export requests
- Application errors

Example

```json
{
  "event": "verification",
  "pass": true,
  "totalEntries": 52
}
```

---

# Future Improvements

Potential enhancements include:

- Merkle Tree batching
- Background integrity verification jobs
- Prometheus metrics
- Grafana dashboards
- Webhook notifications
- Kafka event streaming
- JWT authentication
- Role-based access control (RBAC)
- Digital signatures
- Multi-tenant support
- Immutable object storage backups
- Distributed verification service

---

# AI Usage Log

AI-assisted development was used responsibly during this project.

| Task | AI Assistance |
|------|---------------|
| Architecture planning | Yes |
| Code review | Yes |
| Documentation | Yes |
| Test case generation | Yes |
| Boilerplate generation | Yes |
| Final implementation | Reviewed and customized by the developer |

All generated code was reviewed, tested, and modified where necessary before inclusion in the project.

---

# License

This project is licensed under the **MIT License**.

Feel free to use, modify, and distribute this project for educational and personal purposes.

---

## Author

**Vishal Sandipan Devkate**

Bachelor of Engineering (Electronics and Computer Engineering)

Production-ready backend project demonstrating secure software engineering practices, cryptographic integrity verification, clean architecture, and REST API design.
