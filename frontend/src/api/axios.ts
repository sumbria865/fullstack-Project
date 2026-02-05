import axios from "axios";

const BASE_API =
  (import.meta as any)?.env?.VITE_API_URL ||
  (typeof process !== "undefined" ? (process as any).env?.REACT_APP_API_URL : undefined) ||
  "https://fullstack-project-vuqf.onrender.com";

const api = axios.create({
  baseURL: `${BASE_API}/api`,
  withCredentials: true,
});

// ================= REQUEST INTERCEPTOR =================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ================= RESPONSE INTERCEPTOR =================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // ❌ Token invalid / expired
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    if (status === 403) {
      // ❌ Logged in but no permission
      alert("You are not allowed to access this page");
      window.location.href = "/dashboard";
    }

    return Promise.reject(error);
  }
);

export default api;
