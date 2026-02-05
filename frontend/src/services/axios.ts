import axios from "axios";

const BASE_API =
  (import.meta as any)?.env?.VITE_API_URL ||
  (typeof process !== "undefined" ? (process as any).env?.REACT_APP_API_URL : undefined) ||
  "https://fullstack-project-vuqf.onrender.com";

const api = axios.create({
  baseURL: `${BASE_API}/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
