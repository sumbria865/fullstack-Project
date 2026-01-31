import api from "./api";

export interface Ticket {
  id: string;
  title: string;
  description?: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  status: "TODO" | "IN_PROGRESS" | "DONE";
  projectId: string;
  createdAt: string;
}

/* ===============================
   FETCH TICKETS
================================ */
export const getTickets = async (projectId?: string) => {
  const url = projectId ? `/tickets?projectId=${projectId}` : "/tickets";
  const res = await api.get(url);
  return res.data as Ticket[];
};

/* ===============================
   CREATE TICKET  ✅ FIXED
================================ */
export const createTicket = async (data: {
  title: string;
  description?: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  projectId: string;
}) => {
  const res = await api.post("/tickets", {
    title: data.title,
    description: data.description,
    priority: data.priority,
    projectId: data.projectId,
  });

  return res.data as Ticket;
};
