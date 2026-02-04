import api from "./api";

/* ===============================
   TYPES
================================ */
export interface Ticket {
  id: string;
  title: string;
  description?: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  status: "TODO" | "IN_PROGRESS" | "DONE";
  projectId: string;
  assigneeId?: string;
  assignee?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

/* ===============================
   FETCH ALL TICKETS (ADMIN / MANAGER)
================================ */
export const getTickets = async (projectId?: string) => {
  const url = projectId
    ? `/tickets?projectId=${projectId}`
    : "/tickets";

  const res = await api.get(url);
  return res.data as Ticket[];
};

/* ===============================
   FETCH MY TICKETS (USER)
================================ */
export const getMyTickets = async () => {
  const res = await api.get("/tickets/my");
  return res.data as Ticket[];
};

/* ===============================
   CREATE TICKET (ADMIN)
================================ */
export const createTicket = async (data: {
  title: string;
  description?: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  projectId: string;
  assigneeId?: string;
}) => {
  const res = await api.post("/tickets", data);
  return res.data;
};

/* ===============================
   ASSIGN TICKET (ADMIN / MANAGER)
================================ */
export const assignTicket = async (
  ticketId: string,
  userId: string
) => {
  const res = await api.post("/tickets/assign", {
    ticketId,
    userId,
  });

  return res.data;
};

/* ===============================
   UPDATE TICKET STATUS (ADMIN / MANAGER)
================================ */
export const updateTicketStatus = async (
  ticketId: string,
  status: "TODO" | "IN_PROGRESS" | "DONE"
) => {
  const res = await api.patch(`/tickets/${ticketId}/status`, {
    status,
  });

  return res.data as Ticket;
};

/* ===============================
   UPDATE MY TICKET STATUS (USER)
================================ */
export const updateMyTicketStatus = async (
  ticketId: string,
  status: "TODO" | "IN_PROGRESS" | "DONE"
) => {
  const res = await api.patch(`/tickets/${ticketId}/my-status`, {
    status,
  });

  return res.data as Ticket;
};
