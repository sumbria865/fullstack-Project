import api from "./api";

export const getProfile = (userId: string) =>
  api.get(`/profile/${userId}`);

export const updateProfile = (
  userId: string,
  data: { name?: string; role?: string }
) =>
  api.put(`/profile/${userId}`, data);
