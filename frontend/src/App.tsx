import { Routes, Route, Navigate } from "react-router-dom";

/* ---------- Pages ---------- */
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectReports from "./pages/ProjectReports";
import TicketListPage from "./pages/TicketListPage";
import TicketDetails from "./pages/TicketDetails";
import CreateTicketPage from "./pages/CreateTicketPage";
import KanbanBoard from "./pages/kanbanBoard";
import Profile from "./pages/Profile";
import CreateProjectPage from "./pages/CreateProjectPage";
import CommentsPage from "./pages/CommentsPage";

/* ---------- Context ---------- */
import { ProjectProvider } from "./context/ProjectContext";

/* ---------- Protection ---------- */
import ProtectedRoute from "./routes/ProtectedRoute";
import React from "react";

export default function App() {
  return (
    <Routes>
      {/* ---------- Auth ---------- */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ---------- Dashboard ---------- */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "MANAGER", "USER"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* ---------- Projects ---------- */}
      <Route
        path="/projects"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "MANAGER", "USER"]}>
            <ProjectProvider>
              <Projects />
            </ProjectProvider>
          </ProtectedRoute>
        }
      />

      {/* ---------- Project Reports (ADMIN / MANAGER) ---------- */}
      <Route
        path="/projects/:projectId"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "MANAGER"]}>
            <ProjectProvider>
              <ProjectReports />
            </ProjectProvider>
          </ProtectedRoute>
        }
      />

      {/* ---------- Tickets ---------- */}
      <Route
        path="/projects/:projectId/tickets"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "MANAGER", "USER"]}>
            <TicketListPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/projects/:projectId/create-ticket"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "MANAGER"]}>
            <CreateTicketPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tickets/:ticketId"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "MANAGER", "USER"]}>
            <TicketDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tickets/:ticketId/comments"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "MANAGER", "USER"]}>
            <CommentsPage />
          </ProtectedRoute>
        }
      />

      {/* ---------- Kanban (ADMIN / MANAGER) ---------- */}
      <Route
        path="/projects/:projectId/kanban"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "MANAGER"]}>
            <KanbanBoard />
          </ProtectedRoute>
        }
      />

      {/* ---------- Profile ---------- */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "MANAGER", "USER"]}>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* ---------- Admin Only ---------- */}
      <Route
        path="/create-project"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <CreateProjectPage />
          </ProtectedRoute>
        }
      />

      {/* ---------- Fallback ---------- */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
