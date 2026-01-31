import api from "./api";

export const getComments = (ticketId: string) =>
  api.get(`/tickets/${ticketId}/comments`);

export const addComment = (ticketId: string, text: string) =>
  api.post(`/tickets/${ticketId}/comments`, { text });
