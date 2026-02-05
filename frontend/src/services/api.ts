import axios from "axios";

const BASE_API =
  (typeof process !== "undefined" ? (process as any).env?.VITE_API_URL : undefined) ||
  (typeof process !== "undefined" ? (process as any).env?.REACT_APP_API_URL : undefined) ||
  "https://fullstack-project-vuqf.onrender.com";

const api = axios.create({
  baseURL: `${BASE_API}/api`,
  withCredentials: true, // 🔥 VERY IMPORTANT
});

// Log resolved baseURL to help diagnose 404s during deploy
console.log("API baseURL:", api.defaults.baseURL);

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // 🔁 must match login

    if (token && token !== "undefined" && token !== "null") {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("JWT expired or invalid → logging out");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
