import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTickets } from "../services/ticket.service";

interface Ticket {
  id: string;
  title: string;
  description?: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "TODO" | "IN_PROGRESS" | "DONE";
  assignee?: {
    name?: string;
  };
}

export default function TicketListPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;

    const fetchTickets = async () => {
      try {
        const data = await getTickets(projectId);

        // ✅ SAFETY: ensure array
        setTickets(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load tickets", err);
        setTickets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [projectId]);

  if (loading) {
    return <div className="p-8 text-gray-500">Loading tickets...</div>;
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tickets</h1>

        <button
          onClick={() => navigate(`/projects/${projectId}/create-ticket`)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Create Ticket
        </button>
      </div>

      {tickets.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No tickets yet
        </div>
      ) : (
        <div className="grid gap-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => navigate(`/tickets/${ticket.id}`)}
              className="cursor-pointer bg-white rounded-xl border p-4 hover:shadow-md transition"
            >
              <div className="flex justify-between items-center">
                <h2 className="font-semibold">{ticket.title}</h2>
                <span className="text-xs text-gray-500">
                  {ticket.priority}
                </span>
              </div>

              <p className="text-sm text-gray-600 mt-1">
                {ticket.description || "No description"}
              </p>

              <div className="text-xs text-gray-400 mt-2">
                Status: {ticket.status}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
