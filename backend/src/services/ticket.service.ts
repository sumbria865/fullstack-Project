import api from "./api";

/* ======================================================
   FETCH TICKETS (BY PROJECT)
   ====================================================== */
export const getTickets = async (projectId?: string) => {
  const res = await api.get(
    projectId ? `/tickets?projectId=${projectId}` : "/tickets"
  );

  // ✅ ALWAYS return an array
  if (Array.isArray(res.data)) {
    return res.data;
  }

  if (Array.isArray(res.data.data)) {
    return res.data.data;
  }

  // fallback safety
  return [];
};

/* ======================================================
   CREATE TICKET
   ====================================================== */
export const createTicket = async (data: {
  title: string;
  description?: string;
  priority: "Low" | "Medium" | "High"; // ✅ MATCH UI & DB
  projectId: string;
}) => {
  const res = await api.post("/tickets", {
    ...data,
    status: "TODO", // ensure status exists
  });

  return res.data;
};
