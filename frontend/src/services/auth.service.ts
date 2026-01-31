import api from "./api";

interface LoginPayload {
  email: string;
  password: string;
}

export const login = async (payload: LoginPayload) => {
  const res = await api.post("/auth/login", payload);

  const { token, user } = res.data;

  // ✅ Save in localStorage
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));

  return user;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const getToken = () => {
  return localStorage.getItem("token");
};
