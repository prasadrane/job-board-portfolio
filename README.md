# 🚀 JobBoard Pro - Full Stack Job Platform

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10-red)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

A modern job board platform with real-time features, AI resume parsing, and secure payments.

## ✨ Features

- 🔐 Multi-role authentication (Job Seeker/Employer/Admin)
- 💼 Real-time job applications & notifications
- 🔍 Advanced job search with filters
- 📄 AI-powered resume parsing
- 💳 Secure payment processing (Stripe)
- 📱 Fully responsive design
- 🚀 Performance optimized

## 🏗️ Architecture

(frontend) Next.js → (backend) NestJS → (db) PostgreSQL → (cache) Redis

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v18+)
- Docker & Docker Compose
- PostgreSQL (if running locally without Docker)

### 1. Infrastructure
Start the database and cache services:
```bash
docker-compose up -d
```

### 2. Backend Setup
```bash
cd backend
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env # (Create .env based on requirement)
# Ensure DATABASE_URL is set to: postgres://user:password@localhost:5432/jobboard

# Generate Prisma Client
npx prisma generate

# Run migrations (if needed)
# npx prisma migrate dev

# Start server
npm run start:dev
```

### 3. Frontend Setup
```bash
cd frontend
# Install dependencies
npm install

# **IMPORTANT**: Copy shared library (Workaround)
# You must manually copy the shared library to the frontend source 
# because of current monorepo resolution limitations.
# On Windows (PowerShell):
Copy-Item -Recurse -Force ..\shared\src src\shared-lib
# On Mac/Linux:
# cp -r ../shared/src src/shared-lib

# Start development server
npm run dev
```

## 🚀 Running the App
- **Backend API**: http://localhost:3000
- **Frontend**: http://localhost:3001 (or 3000 if backend is on different port)

