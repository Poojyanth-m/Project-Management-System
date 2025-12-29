# Project Pulse - Enterprise Project Management System

Project Pulse is a comprehensive, state-of-the-art project management platform designed to streamline team collaboration, task tracking, and resource management. Built with a focus on premium user experience and robust enterprise features, it offers a unified hub for modern development teams.

## 🚀 Overview

Project Pulse provides full visibility into project lifecycles, from initial planning to delivery. It features a sophisticated dashboard, real-time analytics, integrated time tracking, and a powerful Gantt chart for scheduling.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: [React](https://reactjs.org/) with [Vite](https://vitejs.dev/)
- **UI Library**: [Material UI (MUI)](https://mui.com/)
- **Styling**: Vanilla CSS with Glassmorphism principles
- **State Management**: React Hooks & Context API
- **Networking**: [Axios](https://axios-http.com/)
- **Notifications**: [Notistack](https://notistack.com/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: PostgreSQL (or SQLite for development)
- **Authentication**: JWT (JSON Web Tokens) with secure refreshing

---

## ✨ Key Features

- **Dynamic Dashboard**: Real-time project health metrics and activity logs.
- **Advanced Gantt Chart**: Visual timeline management with task dependencies.
- **Kanban & List Views**: Flexible task management workflows.
- **Resource Management**: Track team bandwidth and allocation over time.
- **Budgeting & Expenses**: Integrated financial tracking for project costs.
- **Analytics Hub**: Detailed reports on productivity, task completion, and resource usage.
- **Premium UI/UX**: Sophisticated glassmorphism design with professional micro-animations.

---

## 📁 Project Structure

The project is organized as a monorepo for seamless management:

```text
Project-Management-System/
├── projectpulse-backend/     # Node.js/Express TypeScript API
├── projectpulse-frontend/    # React/Vite TypeScript Application
└── README.md                 # Project Documentation
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- A PostgreSQL database (or use the default Prisma SQLite setup)

### 1. Backend Setup
```bash
cd projectpulse-backend
npm install
# Configure your .env file (see .env.example)
npx prisma migrate dev
npm run dev
```

### 2. Frontend Setup
```bash
cd projectpulse-frontend
npm install
npm run dev
```

The application will be available at `http://localhost:5173`.

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributors

- **Poojyanth M** - *Lead Developer* - [GitHub Profile](https://github.com/Poojyanth-m)

---
*Built with ❤️ for modern project orchestration.*
