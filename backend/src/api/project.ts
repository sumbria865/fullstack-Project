import api from "./axios";

export const createProject = async (data: {
  name: string;
  description?: string;
}) => {
  const res = await api.post("/projects", data);
  return res.data;
};

export const getProjects = async () => {
  const res = await api.get("/projects");
  return res.data;
};
