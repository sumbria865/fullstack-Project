import axios from "axios";

// Axios instance
const api = axios.create({
  baseURL: "http://localhost:5000/api", // keep this as it is
});

// Request interceptor: attach token if exists
api.interceptors.request.use(
  (config) => {
    if (!config) return config;

    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: optional, handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token missing or expired, clear it and redirect to login
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
