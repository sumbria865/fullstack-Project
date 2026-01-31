import axios from "axios";

// Axios instance for API requests
const API_URL = "http://localhost:5000/api";

// Helper to get JWT token from localStorage
const getToken = () => localStorage.getItem("token") || "";

// Create a custom Axios instance with Authorization header
const api = axios.create({
  baseURL: API_URL,
});

// Add request interceptor to include token in every request
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

// ---------------- Project Type ----------------
export interface Project {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// ---------------- Get all projects ----------------
export const getProjects = async (): Promise<Project[]> => {
  try {
    const res = await api.get("/projects");
    return res.data;
  } catch (error: any) {
    console.error("Error fetching projects:", error.response || error);
    throw error;
  }
};

// ---------------- Create a new project ----------------
export const createProject = async (
  name: string,
  description: string
): Promise<Project> => {
  try {
    const res = await api.post("/projects", { name, description });
    return res.data;
  } catch (error: any) {
    console.error("Error creating project:", error.response || error);
    throw error;
  }
};

// ---------------- Delete a project ----------------
export const deleteProject = async (id: string): Promise<{ message: string }> => {
  try {
    const res = await api.delete(`/projects/${id}`);
    return res.data;
  } catch (error: any) {
    console.error(`Error deleting project ${id}:`, error.response || error);
    throw error;
  }
};
