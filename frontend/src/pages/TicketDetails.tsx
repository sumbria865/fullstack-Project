import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

interface Ticket {
  _id: string;
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "TODO" | "IN_PROGRESS" | "DONE";
  assignee?: string;
  files?: { name: string; url: string }[];
}

export default function TicketDetails() {
  const { ticketId } = useParams<{ ticketId: string }>();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!ticketId) {
      setError("Invalid ticket ID");
      setLoading(false);
      return;
    }

    const fetchTicket = async () => {
      try {
        const res = await api.get(`/tickets/${ticketId}`);
        setTicket(res.data);
      } catch (err) {
        console.error("Failed to fetch ticket", err);
        setError("Failed to fetch ticket");
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [ticketId]);

  /* ---------- UI STATES ---------- */

  if (loading) return <p className="p-8">Loading ticket...</p>;

  if (error)
    return <p className="p-8 text-red-600">{error}</p>;

  if (!ticket)
    return <p className="p-8">Ticket not found</p>;

  /* ---------- RENDER ---------- */

  return (
    <div className="min-h-screen p-8 space-y-4">
      <h1 className="text-3xl font-bold">{ticket.title}</h1>

      <p className="text-gray-700">{ticket.description}</p>

      <div className="space-y-1">
        <p>
          <strong>Priority:</strong> {ticket.priority}
        </p>
        <p>
          <strong>Status:</strong> {ticket.status}
        </p>
        <p>
          <strong>Assignee:</strong>{" "}
          {ticket.assignee || "Unassigned"}
        </p>
      </div>

      {ticket.files && ticket.files.length > 0 && (
        <div>
          <h3 className="font-semibold mt-4">Files</h3>
          <div className="flex gap-3 flex-wrap">
            {ticket.files.map((file) => (
              <a
                key={file.url}
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-600"
              >
                {file.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
