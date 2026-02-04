// components/kanban/tickets.ts
import { Ticket } from "./types";

export const tickets: Ticket[] = [
  {
    id: "1",
    title: "Fix login bug",
    priority: "HIGH",
    status: "TODO",
    assignee: { id: "u1", name: "Prinka" },
  },
  {
    id: "2",
    title: "Create dashboard UI",
    priority: "MEDIUM",
    status: "IN_PROGRESS",
    assignee: { id: "u2", name: "Dev Team" },
  },
  {
    id: "3",
    title: "Deploy backend",
    priority: "LOW",
    status: "DONE",
    assignee: { id: "u3", name: "Admin" },
  },
];
