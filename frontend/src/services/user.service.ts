import api from "./api";

export interface User {
  id: string;
  name: string;
  role: "ADMIN" | "MANAGER" | "USER";
}

export const getUsers = async () => {
  const res = await api.get("/users");
  return res.data as User[];
};

export const changeEmail = async (newEmail: string, password: string) => {
  const res = await api.put("/users/me/email", { newEmail, password });
  return res.data;
};

export const changePassword = async (currentPassword: string, newPassword: string) => {
  const res = await api.put("/users/me/password", { currentPassword, newPassword });
  return res.data;
};
