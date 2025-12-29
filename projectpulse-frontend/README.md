# Project Pulse

![Project Pulse Badge](https://img.shields.io/badge/Status-Active_Development-success)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![MUI](https://img.shields.io/badge/MUI-5.0-blue)

**Project Pulse** is a next-generation Project Management System (PMS) designed to streamline workflows, enhance team collaboration, and provide actionable insights through a premium, glassmorphic user interface. Built with modern web technologies, it offers a distinct visual identity characterized by translucency, depth, and vibrant accent colors.

---

## 🚀 Features

-   **Interactive Dashboard**: Real-time project tracking with visual progress indicators.
-   **Kanban Task Management**: Drag-and-drop task boards with custom columns.
-   **User Management**: Role-based access control (RBAC) and detailed user profiles.
-   **Settings Hub**: A centralized configuration panel for profile, security, and appearance preferences.
-   **Dynamic Theming**: Built-in support for Light, Dark, and System theme modes.
-   **Glassmorphism UI**: A consistent, high-fidelity design language using blur effects and subtle gradients.

---

## 🛠 Tech Stack

-   **Frontend Framework**: [React](https://react.dev/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **UI Library**: [Material UI (MUI)](https://mui.com/)
-   **Styling**: Custom Glassmorphism tokens + CSS Modules (Global CSS)
-   **State Management**: React Context API
-   **Routing**: React Router DOM
-   **Notifications**: Notistack

---

## 🏁 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v16 or higher)
-   [npm](https://www.npmjs.com/) or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-org/projectpulse-frontend.git
    cd projectpulse-frontend/pms-frontend
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Start the development server**
    ```bash
    npm run dev
    ```

4.  **Open in Browser**
    Navigate to `http://localhost:5173` to view the application.

---

## 📂 Project Structure

```bash
src/
├── assets/          # Static assets (images, fonts)
├── components/      # Reusable UI components
│   ├── layout/      # Layout components (Sidebar, TopBar)
│   └── common/      # Generic buttons, inputs, cards
├── context/         # React Context Providers (Theme, Project)
├── layouts/         # Page layout wrappers (MainLayout)
├── pages/           # Application views
│   ├── auth/        # Login & Register
│   ├── settings/    # Settings Hub
│   ├── tasks/       # Kanban Board
│   └── users/       # User Directory
├── routes/          # Route definitions
├── theme/           # MUI Theme configuration & global tokens
└── App.tsx          # Root Application component
```

---

## 🎨 Design System

Project Pulse follows a strict **Glassmorphism** design system.

### Core Principles
-   **Glass Style**: Backgrounds use `rgba(255, 255, 255, 0.6)` with `backdrop-filter: blur(10px)`.
-   **Typography**: Clean sans-serif fonts with distinct hierarchy.
-   **Color Palette**:
    -   **Primary (Brand)**: Orange `#E65F2B`
    -   **Background**: Beige `#EBDFD7` (Light Mode)
    -   **Text**: Dark Grey `#1A1A1A`

### Theming
The application supports **Dark Mode**. Appearance settings are persisted in `localStorage`. To modify theme tokens, check `src/theme/theme.ts`.

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

© 2024 Project Pulse. All Rights Reserved.
