import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createTicket } from "../services/ticket.service";

export default function CreateTicketPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !projectId) return;

    try {
      setLoading(true);

      // ✅ FIX: pass a SINGLE object
      await createTicket({
        title,
        description,
        priority,
        projectId,
      });

      navigate(`/projects/${projectId}/tickets`);
    } catch (err) {
      console.error("Create ticket failed:", err);
      alert("Failed to create ticket. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Create Ticket</h1>
          <p className="text-sm text-gray-500">
            Add a new issue to this project
          </p>
        </div>

        <div>
          <label className="text-sm font-medium">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Bug title"
            className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Explain the issue..."
            rows={4}
            className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Priority</label>
          <div className="flex gap-3 mt-2">
            {(["LOW", "MEDIUM", "HIGH"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition
                  ${
                    priority === p
                      ? p === "HIGH"
                        ? "bg-red-600 text-white border-red-600"
                        : p === "MEDIUM"
                        ? "bg-yellow-500 text-white border-yellow-500"
                        : "bg-green-600 text-white border-green-600"
                      : "bg-white text-gray-600 hover:bg-gray-100"
                  }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="border px-4 py-2 rounded-lg"
          >
            Cancel
          </button>

            <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !title.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Ticket"}
          </button>
        </div>
      </div>
    </div>
  );
}
