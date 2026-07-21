import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import ProjectDetail from "./pages/ProjectDetail";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";

import { AuthProvider } from "./admin/AuthContext";
import ProtectedRoute from "./admin/ProtectedRoute";
import Login from "./admin/pages/Login";
import Dashboard from "./admin/pages/Dashboard";
import ProjectsAdmin from "./admin/pages/ProjectsAdmin";
import SkillsAdmin from "./admin/pages/SkillsAdmin";
import ExperienceAdmin from "./admin/pages/ExperienceAdmin";
import ServicesAdmin from "./admin/pages/ServicesAdmin";
import MessagesAdmin from "./admin/pages/MessagesAdmin";
import CVAdmin from "./admin/pages/CVAdmin";
import SettingsAdmin from "./admin/pages/SettingsAdmin";

export default function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <Routes>
        {/* Site public */}
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
        <Route
          path="/project/:slug"
          element={
            <MainLayout>
              <ProjectDetail />
            </MainLayout>
          }
        />

        {/* Espace admin */}
        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/projects"
          element={
            <ProtectedRoute>
              <ProjectsAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/skills"
          element={
            <ProtectedRoute>
              <SkillsAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/experience"
          element={
            <ProtectedRoute>
              <ExperienceAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/services"
          element={
            <ProtectedRoute>
              <ServicesAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/messages"
          element={
            <ProtectedRoute>
              <MessagesAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/cv"
          element={
            <ProtectedRoute>
              <CVAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute>
              <SettingsAdmin />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={
            <MainLayout>
              <NotFound />
            </MainLayout>
          }
        />
      </Routes>
    </AuthProvider>
  );
}
