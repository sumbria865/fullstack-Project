import { Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
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

export default function App() {
  return (
    <AppProvider>
      <Routes>
        {/* ---------- Auth ---------- */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ---------- Dashboard ---------- */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* ---------- Projects ---------- */}
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:projectId" element={<ProjectReports />} />

        {/* ✅ Tickets (PROJECT SCOPED) */}
        <Route
          path="/projects/:projectId/tickets"
          element={<TicketListPage />}
        />

        <Route
          path="/projects/:projectId/create-ticket"
          element={<CreateTicketPage />}
        />

        {/* ---------- Ticket Details ---------- */}
        <Route path="/tickets/:ticketId" element={<TicketDetails />} />
        <Route
          path="/tickets/:ticketId/comments"
          element={<CommentsPage />}
        />

        {/* ---------- Kanban ---------- */}
      <Route path="/projects/:projectId/kanban" element={<KanbanBoard />} />

        {/* ---------- Others ---------- */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/create-project" element={<CreateProjectPage />} />
        <Route path="/reports" element={<ReportsPage />} />

        {/* ---------- Safety ---------- */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </AppProvider>
  );
}
