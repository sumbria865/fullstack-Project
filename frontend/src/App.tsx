import { Routes, Route, Navigate } from "react-router-dom";
import React from "react";

/* ---------- Pages ---------- */
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectReports from "./pages/ProjectReports";
import TicketListPage from "./pages/TicketListPage";
import TicketDetails from "./pages/TicketDetails";
import CreateTicketPage from "./pages/CreateTicketPage";
import KanbanBoard from "./pages/KanbanBoard";
import Profile from "./pages/Profile";
import CreateProjectPage from "./pages/CreateProjectPage";
import ReportsPage from "./pages/ReportsPage";
import CommentsPage from "./pages/CommentsPage";

/* ---------- Role Dashboards ---------- */
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import ManagerDashboard from "./pages/dashboard/ManagerDashboard";
import UserDashboard from "./pages/dashboard/UserDashboard";

/* ---------- Protection ---------- */
import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* ---------- Auth ---------- */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ---------- Role Dashboards ---------- */}
      <Route
        path="/dashboard/admin"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/manager"
        element={
          <ProtectedRoute allowedRoles={["MANAGER"]}>
            <ManagerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/user"
        element={
          <ProtectedRoute allowedRoles={["USER"]}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      {/* ---------- Generic Dashboard Redirect ---------- */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* ---------- Projects ---------- */}
      <Route
        path="/projects"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "MANAGER", "USER"]}>
            <Projects />
          </ProtectedRoute>
        }
      />

      <Route
        path="/projects/:projectId"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "MANAGER"]}>
            <ProjectReports />
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

      {/* ---------- Kanban ---------- */}
      <Route
        path="/projects/:projectId/kanban"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "MANAGER"]}>
            <KanbanBoard />
          </ProtectedRoute>
        }
      />

      {/* ---------- Others ---------- */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "MANAGER", "USER"]}>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-project"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <CreateProjectPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <ReportsPage />
          </ProtectedRoute>
        }
      />

     

      {/* ---------- Fallback ---------- */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}
