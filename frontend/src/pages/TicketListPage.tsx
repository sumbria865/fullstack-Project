import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTickets, assignTicket } from "../services/ticket.service";
import { getUsers } from "../services/project.service";
import React from "react";

interface Ticket {
  id: string;
  title: string;
  description?: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "TODO" | "IN_PROGRESS" | "DONE";
  assignee?: {
    id?: string;
    name?: string;
  };
}

interface User {
  id: string;
  name: string;
}

export default function TicketListPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState<{ [key: string]: boolean }>({});

  // Fetch tickets
  useEffect(() => {
    if (!projectId) return;

    const fetchTickets = async () => {
      try {
        const data = await getTickets(projectId);
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

  // Fetch users for assignment
  useEffect(() => {
    if (!projectId) return;

    const fetchUsers = async () => {
      try {
        const data = await getUsers(projectId);
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load users", err);
        setUsers([]);
      }
    };

    fetchUsers();
  }, [projectId]);

  const handleAssign = async (ticketId: string, userId: string) => {
    setAssigning((prev) => ({ ...prev, [ticketId]: true }));
    try {
      await assignTicket(ticketId, userId);
      // Update the ticket's assignee locally
      setTickets((prev) =>
        prev.map((t) =>
          t.id === ticketId
            ? {
                ...t,
                assignee: users.find((u) => u.id === userId) || undefined,
              }
            : t
        )
      );
    } catch (err) {
      console.error("Failed to assign ticket", err);
      alert("Failed to assign ticket");
    } finally {
      setAssigning((prev) => ({ ...prev, [ticketId]: false }));
    }
  };

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
        <div className="text-center py-20 text-gray-500">No tickets yet</div>
      ) : (
        <div className="grid gap-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white rounded-xl border p-4 hover:shadow-md transition"
            >
              <div className="flex justify-between items-center">
                <h2 className="font-semibold">{ticket.title}</h2>
                <span className="text-xs text-gray-500">{ticket.priority}</span>
              </div>

              <p className="text-sm text-gray-600 mt-1">
                {ticket.description || "No description"}
              </p>

              <div className="text-xs text-gray-400 mt-2">
                Status: {ticket.status}
              </div>

              {/* Assignee Dropdown */}
              <div className="mt-3">
                <label className="text-xs text-gray-500">Assignee:</label>
                <select
                  className="mt-1 block w-full border rounded-md p-2 text-sm"
                  value={ticket.assignee?.id || ""}
                  onChange={(e) => handleAssign(ticket.id, e.target.value)}
                  disabled={assigning[ticket.id]}
                >
                  <option value="">Unassigned</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
