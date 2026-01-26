import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

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
        const res = await api.get("/tickets", {
          params: { projectId },
        });
        setTickets(res.data);
      } catch (err) {
        console.error("Failed to load tickets", err);
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tickets</h1>

        <button
          onClick={() => navigate(`/projects/${projectId}/create-ticket`)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          + Create Ticket
        </button>
      </div>

      {/* Empty State */}
      {tickets.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg font-medium">No tickets yet</p>
          <p className="text-sm mt-1">
            Create your first ticket to start tracking issues 🚀
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => navigate(`/tickets/${ticket.id}`)}
              className="cursor-pointer bg-white rounded-xl border p-4 hover:shadow-md transition"
            >
              {/* Title + Priority */}
              <div className="flex justify-between items-start">
                <h2 className="font-semibold text-lg">{ticket.title}</h2>

                <span
                  className={`px-2 py-1 text-xs rounded-full font-medium ${
                    ticket.priority === "HIGH"
                      ? "bg-red-100 text-red-700"
                      : ticket.priority === "MEDIUM"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {ticket.priority}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {ticket.description || "No description"}
              </p>

              {/* Footer */}
              <div className="flex justify-between items-center mt-3 text-sm">
                <span
                  className={`px-2 py-1 rounded ${
                    ticket.status === "TODO"
                      ? "bg-gray-100 text-gray-700"
                      : ticket.status === "IN_PROGRESS"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {ticket.status.replace("_", " ")}
                </span>

                <span className="text-gray-500">
                  {ticket.assignee?.name || "Unassigned"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
