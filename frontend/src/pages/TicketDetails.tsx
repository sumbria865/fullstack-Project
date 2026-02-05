import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";


interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "TODO" | "IN_PROGRESS" | "DONE";
  assignee?: {
    id?: string;
    name?: string;
  };
  files?: { name: string; url: string }[];
}

export default function TicketDetails() {
  const { ticketId } = useParams<{ ticketId: string }>();

  console.log("✅ TicketDetails loaded, ticketId:", ticketId);

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
        console.log("🎟 Ticket API response:", res.data);
        setTicket(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch ticket", err);
        setError("Failed to fetch ticket");
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [ticketId]);

  if (loading) return <p className="p-8">Loading ticket...</p>;
  if (error) return <p className="p-8 text-red-600">{error}</p>;
  if (!ticket) return <p className="p-8">Ticket not found</p>;

  return (
    <div className="min-h-screen p-8 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">{ticket.title}</h1>

      <p className="text-gray-700">{ticket.description}</p>

      <div className="space-y-1">
        <p><strong>Priority:</strong> {ticket.priority}</p>
        <p><strong>Status:</strong> {ticket.status}</p>
        <p>
          <strong>Assignee:</strong>{" "}
          {ticket.assignee?.name || "Unassigned"}
        </p>
      </div>

      {/* COMMENTS LINK */}
      <div className="pt-4">
        <Link
  to={`/tickets/${ticket.id}/comments`}
  className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
>
  View Comments
</Link>

      </div>
    </div>
  );
}
