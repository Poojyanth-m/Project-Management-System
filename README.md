# Project Pulse | Enterprise Project Management Suite

[![License: MIT](https://img.shields.io/badge/License-MIT-orange.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/React-v19-blue.svg)](https://react.dev/)
[![Prisma ORM](https://img.shields.io/badge/ORM-Prisma-2D3748.svg)](https://www.prisma.io/)

**Project Pulse** is a high-performance, enterprise-grade Project Management System (PMS) designed for modern engineering and creative teams. Built with a focus on **operational visibility, team orchestration, and financial transparency**, it provides a unified hub for managing complex project lifecycles with a premium, state-of-the-art user experience.

---

## 🏛️ System Architecture

Project Pulse follows a decoupled **Client-Server Architecture** optimized for scalability and maintainability.

-   **Frontend**: A high-speed Single Page Application (SPA) built with React 19 and Vite. It utilizes a custom design system based on Glassmorphism principles for a premium aesthetic.
-   **Backend**: A robust, modular RESTful API powered by Node.js and Express. It features a strongly-typed TypeScript core and uses Prisma ORM for type-safe database interactions.
-   **Database**: A relational PostgreSQL schema designed for complex data relationships, including multi-level task hierarchies and resource allocation matrices.
-   **Real-time Layer**: Staggered polling and WebSocket-ready infrastructure for immediate UI updates.

---

## 💻 Technical Stack

### **Frontend Orchestration**
| Technology | Usage |
| :--- | :--- |
| **React 19** | Core UI framework with advanced Hook patterns |
| **TypeScript** | Static typing for enterprise reliability |
| **Material UI (MUI)** | Foundation for high-fidelity component design |
| **Vite** | Next-generation frontend tooling and HMR |
| **Axios** | Interceptor-based API communication |
| **Frappe Gantt** | High-performance interactive timeline rendering |
| **Notistack** | Context-driven snackbar notification system |

### **Backend Infrastructure**
| Technology | Usage |
| :--- | :--- |
| **Node.js & Express** | Scalable server runtime and routing |
| **TypeScript** | End-to-end type safety across the API |
| **Prisma ORM** | Schema-first database orchestration |
| **PostgreSQL** | Primary relational data persistence |
| **JWT (JsonWebToken)** | Secure stateless authentication with Refresh logic |
| **Bcrypt** | Industry-standard password hashing |
| **Zod** | Schema validation for API request payloads |
| **Winston** | Multi-level production logging |

---

## 🚀 Key Modules & Features

### 📦 1. Core Project Management
-   **Project Lifecycle Hub**: Track projects through `PLANNED`, `ACTIVE`, `ON_HOLD`, and `COMPLETED` phases.
-   **Team Orchestration**: Multi-user project assignment with role-based access control (RBAC).
-   **Activity Auditing**: Full audit trail of every modification made to projects and tasks.

### 📊 2. Task Management & Scheduling
-   **Hierarchical Tasks**: Support for parent-child task relationships.
-   **Gantt Chronology**: Interactive timeline with task dependencies and duration tracking.
-   **Prioritization Engine**: Dynamic sorting by `LOW`, `MEDIUM`, and `HIGH` priority.
-   **Kanban Workflow**: Streamlined status transitions from `TODO` to `DONE`.

### ⏱️ 3. Time & Resource Optimization
-   **Precision Time Tracking**: Billable and non-billable time logging against specific tasks.
-   **Resource Allocation**: Monitor team bandwidth and software/hardware allocation.
-   **Availability Matrix**: Visual representation of resource utilization vs. capacity.

### 💰 4. Financial Visibility
-   **Budget Tracking**: Real-time project budget monitoring with utilization rates.
-   **Expense Management**: Categorized expense tracking with approval workflows.
-   **Financial Indicators**: Dynamic "Spent vs. Remaining" progress indicators.

### 📈 5. Advanced Analytics
-   **Productivity Metrics**: Task completion trends and team performance ratios.
-   **Operational Dashboard**: High-level KPI overview for managers and executives.

---

## 📋 API Surface (RESTful endpoints)

All API requests are prefixed with `/api`. Authentication is required for all endpoints except where noted.

| Category | Endpoint | Method | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `/auth/register` | `POST` | Create a new enterprise account (Public) |
| **Auth** | `/auth/login` | `POST` | Authenticate and receive JWT tokens (Public) |
| **Projects** | `/projects` | `GET/POST` | List projects or create a new initiative |
| **Tasks** | `/tasks` | `GET/POST` | Manage granular task items |
| **Timeline** | `/gantt/:projectId` | `GET` | Retrieve structured data for Gantt rendering |
| **Budget** | `/budget/:projectId` | `GET` | Access project financial status |
| **Users** | `/users/me` | `GET` | Retrieve current authenticated user profile |

---

## 🛠️ Corporate Installation Guide

### **Standard Prerequisites**
-   Node.js v18.x or v20.x (LTS recommended)
-   PostgreSQL v14+ Instance
-   NPM or Yarn package manager

### **1. Backend Initialization**
```bash
# Navigate to backend
cd projectpulse-backend

# Install production and development dependencies
npm install

# Configure Environment Variables
# Create a .env file based on .env.example
cp .env.example .env

# Initialize Database Schema
npx prisma migrate dev --name init
npx prisma generate

# Populate Demo Data (Optional)
npm run seed:demo

# Launch Development Server
npm run dev
```

### **2. Frontend Initialization**
```bash
# Navigate to frontend
cd projectpulse-frontend

# Install dependencies
npm install

# Launch production-grade development server
npm run dev
```

---

## 🔒 Security & Standards
-   **Stateless Auth**: Secure JWT-based sessions with short-lived access tokens.
-   **Input Sanitization**: All incoming data is validated using Zod schemas.
-   **Database Integrity**: Referential integrity enforced at the database level via Prisma.
-   **CORS Compliance**: Strict origin-sharing policies for frontend-only access.

---

## 👥 Contributors
-   **Poojyanth M** - *Lead Architect & Full Stack Developer* - [GitHub](https://github.com/Poojyanth-m)

---
*Created and maintained by Poojyanth M. Professional Enterprise Software Solutions.*
