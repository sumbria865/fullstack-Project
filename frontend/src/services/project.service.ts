import api from "./api";

/* =========================
   GET PROJECTS
========================= */
export const getProjects = async () => {
  const res = await api.get("/projects");
  return res.data;
};

/* =========================
   CREATE PROJECT (ADMIN)
========================= */
export const createProject = async (
  name: string,
  description?: string
) => {
  const res = await api.post("/projects", {
    name,
    description,
  });
  return res.data;
};

/* =========================
   DELETE PROJECT (ADMIN)
========================= */
export const deleteProject = async (id: string) => {
  const res = await api.delete(`/projects/${id}`);
  return res.data;
};

/* =========================
   ASSIGN PROJECT TO MANAGER
   (ADMIN only)
========================= */
export const assignProjectToManager = async (
  projectId: string,
  managerId: string
) => {
  const res = await api.post("/projects/assign", {
    projectId,
    managerId,
  });
  return res.data;
};

/* =========================
   GET USERS OF A PROJECT
========================= */
export const getUsers = async (projectId: string) => {
  const res = await api.get(`/projects/${projectId}/users`);
  return res.data; // Should be an array of users [{ id, name }]
};
