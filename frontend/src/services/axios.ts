import axios from "axios";

const BASE_API =
  (typeof process !== "undefined" ? (process as any).env?.VITE_API_URL : undefined) ||
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
