import api from "./api";

export const getProjects = async () => {
  const token = localStorage.getItem("token"); // JWT saved at login
  if (!token) throw new Error("No token found");

  const res = await api.get("/projects", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const createProject = async (name: string, description: string) => {
  const token = localStorage.getItem("token");
  const res = await api.post(
    "/projects",
    { name, description },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const deleteProject = async (id: string) => {
  const token = localStorage.getItem("token");
  const res = await api.delete(`/projects/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
