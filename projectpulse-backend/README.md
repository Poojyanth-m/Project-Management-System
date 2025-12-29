# Project Pulse - Backend API

A comprehensive Project Management System (PMS) built with Node.js, TypeScript, Express.js, and PostgreSQL.

## 📋 Phase 1: Project Setup (COMPLETED)

This backend has been initialized with:
- ✅ Node.js + TypeScript configuration
- ✅ Express.js REST API framework
- ✅ PostgreSQL database with Prisma ORM
- ✅ Zod validation library
- ✅ JWT authentication setup
- ✅ Winston logging
- ✅ Socket.IO for real-time features
- ✅ Modular, service-based architecture

## 🏗️ Project Structure

```
projectpulse-backend/
├── src/
│   ├── config/          # Configuration files (database, logger, env)
│   ├── middlewares/     # Express middlewares (error handler, async wrapper)
│   ├── modules/         # Feature modules (auth, projects, tasks, etc.)
│   │   ├── auth/
│   │   ├── projects/
│   │   ├── tasks/
│   │   ├── users/
│   │   ├── teams/
│   │   ├── files/
│   │   ├── analytics/
│   │   ├── notifications/
│   │   ├── integrations/
│   │   └── reports/
│   ├── utils/           # Utility functions and custom errors
│   ├── types/           # TypeScript type definitions
│   ├── socket/          # Socket.IO configuration
│   ├── app.ts           # Express app setup
│   └── server.ts        # Server entry point
├── prisma/
│   └── schema.prisma    # Database schema
├── logs/                # Application logs
├── uploads/             # File uploads directory
└── dist/                # Compiled JavaScript (generated)
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Installation

1. **Clone and navigate to the backend directory**
   ```bash
   cd projectpulse-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your actual database credentials and configuration.

4. **Set up the database**
   ```bash
   # Create the database in PostgreSQL first, then run:
   npm run prisma:migrate
   ```

### Running the Application

**Development mode:**
```bash
npm run dev
```

**Production build:**
```bash
npm run build
npm start
```

**Other commands:**
```bash
npm run type-check       # TypeScript type checking
npm run prisma:studio    # Open Prisma Studio (DB GUI)
npm run prisma:generate  # Generate Prisma Client
npm run prisma:push      # Push schema changes to DB (no migration)
```

## 📡 API Endpoints

### Health Check
- `GET /health` - Check if the API is running

### Planned Modules (Phase 2+)
- `/api/auth` - Authentication & authorization
- `/api/users` - User management
- `/api/projects` - Project management
- `/api/tasks` - Task management
- `/api/teams` - Team management
- `/api/files` - File upload/management
- `/api/analytics` - Analytics & reporting
- `/api/notifications` - Notification system
- `/api/integrations` - Third-party integrations
- `/api/reports` - Report generation

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Validation:** Zod
- **Authentication:** JWT
- **Logging:** Winston
- **Real-time:** Socket.IO
- **Security:** bcrypt, cors

## 📝 Environment Variables

See `.env.example` for all available configuration options.

Key variables:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `CORS_ORIGIN` - Allowed CORS origin

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Environment-based configuration
- Comprehensive error handling
- Input validation with Zod

## 📊 Logging

Logs are stored in the `logs/` directory:
- `combined.log` - All logs
- `error.log` - Error logs only

Console output is enabled in development mode.

## 🧪 Testing

Testing framework will be added in a future phase.

## 📄 License

ISC

## 👥 Contributing

This is a Phase 1 setup. Module implementations will be added in subsequent phases.

---

**Next Steps:**
- Phase 2: Database schema design & implementation
- Phase 3: Authentication module
- Phase 4: Core modules (users, projects, tasks)
- Phase 5: Advanced features (teams, files, integrations)
