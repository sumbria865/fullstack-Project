import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createTicket } from "../services/ticket.service";
import { getUsers, User } from "../services/user.service";
import React from "react";

export default function CreateTicketPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [assigneeId, setAssigneeId] = useState<string>("");

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch users for dropdown
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await getUsers();
        // only MANAGER / USER
        setUsers(data.filter(u => u.role !== "ADMIN"));
      } catch (err) {
        console.error("Failed to load users", err);
      }
    };

    loadUsers();
  }, []);

  const handleSubmit = async () => {
    if (!title.trim() || !projectId) return;

    try {
      setLoading(true);

      await createTicket({
        title,
        description,
        priority,
        projectId,
        assigneeId: assigneeId || undefined, // ✅ PASS TO BACKEND
      });

      navigate(`/projects/${projectId}/tickets`);
    } catch (err) {
      console.error("Create ticket failed:", err);
      alert("Failed to create ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 space-y-6">

        <h1 className="text-2xl font-bold">Create Ticket</h1>

        {/* TITLE */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ticket title"
          className="w-full border rounded-lg px-3 py-2"
        />

        {/* DESCRIPTION */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          rows={4}
          className="w-full border rounded-lg px-3 py-2"
        />

        {/* PRIORITY */}
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as any)}
          className="w-full border rounded-lg px-3 py-2"
        >
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
        </select>

        {/* ✅ ASSIGN TO */}
        <select
          value={assigneeId}
          onChange={(e) => setAssigneeId(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        >
          <option value="">Unassigned</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} ({u.role})
            </option>
          ))}
        </select>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3">
          <button onClick={() => navigate(-1)} className="border px-4 py-2 rounded-lg">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            {loading ? "Creating..." : "Create Ticket"}
          </button>
        </div>
      </div>
    </div>
  );
}
