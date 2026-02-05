Features
🔐 Authentication & Authorization

JWT-based authentication

Role-based access control:

ADMIN

MANAGER

USER

📁 Projects

Create, view, and delete projects (Admin / Manager)

Project selection drives Kanban & Reports

Search projects by name

🎫 Tickets

Create tickets under projects

Assign tickets to users

Priority levels: HIGH, MEDIUM, LOW

Status flow: TODO → IN_PROGRESS → DONE

🧩 Kanban Board

Project-specific Kanban board

Drag & drop style workflow (status based)

Only available after selecting a project

📊 Reports

Project-wise reports

Ticket statistics by status & priority

Admin-only access

📈 Dashboard

Role-aware dashboard

Ticket counts (TODO / IN PROGRESS / DONE)

Project overview

Recent tickets list

🧭 Sidebar Navigation

Clean and role-aware sidebar

Project → Tickets → Kanban → Reports workflow

Prevents invalid navigation without project context

🛠️ Tech Stack
Frontend

React

TypeScript

React Router v6

Context API

Tailwind CSS

Lucide Icons

Axios

Backend

Node.js

Express

JWT Authentication

RBAC
Role-Based Access Control (RBAC)

This application uses Role-Based Access Control (RBAC) to ensure that users can only access features permitted by their role. Each user is assigned one role, and permissions are enforced on both the frontend and backend.

👥 User Roles
Role	Description
ADMIN	Full system access and control
MANAGER	Manages projects and tickets
USER	Works on assigned tickets only

🗂️ Project Structure
src/
├── components/
│   ├── layout/
│   ├── ui/
│   └── modals/
├── context/
│   ├── AuthContext.tsx
│   ├── ProjectContext.tsx
│   └── AppContext.tsx
├── pages/
│   ├── Dashboard.tsx
│   ├── Projects.tsx
│   ├── KanbanBoard.tsx
│   ├── ProjectReports.tsx
│   └── TicketPages/
├── routes/
│   └── ProtectedRoute.tsx
├── services/
│   ├── api.ts
│   ├── project.service.ts
│   └── ticket.service.ts
├── App.tsx
└── main.tsx
