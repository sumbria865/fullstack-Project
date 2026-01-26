import api from "./api";

/* ======================================================
   FETCH TICKETS (ALL OR BY PROJECT)
   GET /api/tickets
   GET /api/tickets?projectId=xxxx
   ====================================================== */
export const getTickets = async (projectId?: string) => {
  const res = await api.get(
    projectId ? `/tickets?projectId=${projectId}` : "/tickets"
  );

  // ✅ ALWAYS return array (safe handling)
  if (Array.isArray(res.data)) return res.data;
  if (Array.isArray(res.data?.data)) return res.data.data;

  return [];
};

/* ======================================================
   CREATE TICKET
   POST /api/tickets
   ====================================================== */
export const createTicket = async (data: {
  title: string;
  description?: string;
  priority: "LOW" | "MEDIUM" | "HIGH"; // ✅ FIXED (Prisma enum)
  projectId: string;
}) => {
  const res = await api.post("/tickets", {
    ...data,
    status: "TODO", // ✅ REQUIRED by Prisma
  });

  return res.data;
};
