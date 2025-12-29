import MainLayout from '../layouts/MainLayout';
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import Projects from "../pages/projects/Projects";
import Tasks from "../pages/tasks/Tasks";
import TimeTracking from "../pages/time-tracking/TimeTracking";
import Analytics from "../pages/analytics/Analytics";
import Team from "../pages/team/Team";
import Users from "../pages/users/Users";
import Templates from "../pages/templates/Templates";
import Integrations from "../pages/integrations/Integrations";
import Settings from "../pages/settings/Settings";
import Timeline from "../pages/timeline/Timeline";
import Budget from "../pages/budget/Budget";
import CreateProject from "../pages/projects/CreateProject";

import ProtectedRoute from "../components/ProtectedRoute";
import { ProjectProvider } from "../context/ProjectContext";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={
          <ProjectProvider>
            <MainLayout />
          </ProjectProvider>
        }>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/create" element={<CreateProject />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/time-tracking" element={<TimeTracking />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/team" element={<Team />} />
          <Route path="/users" element={<Users />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/budget" element={<Budget />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

export default AppRoutes;
