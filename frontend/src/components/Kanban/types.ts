// components/kanban/types.ts
export type Priority = "LOW" | "MEDIUM" | "HIGH";
export type TicketStatus = "TODO" | "IN_PROGRESS" | "DONE";

export type Ticket = {
  id: string;
  title: string;
  priority: Priority;
  status: TicketStatus;
  assignee?: { id?: string; name: string };
};
