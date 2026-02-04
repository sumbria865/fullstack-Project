import api from "./api";

interface LoginPayload {
  email: string;
  password: string;
}

export const login = async (payload: LoginPayload) => {
  const res = await api.post("/auth/login", payload);

  // 🔍 DEBUG: see what backend is sending
  console.log("LOGIN RESPONSE:", res.data);

  const { token, user } = res.data;

  if (!user?.id || !user?.role) {
    throw new Error("Invalid login response: missing id or role");
  }

  const safeUser = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(safeUser));

  // Return both so callers can update AuthContext immediately
  return { user: safeUser, token };
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
