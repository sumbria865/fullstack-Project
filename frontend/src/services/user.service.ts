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
