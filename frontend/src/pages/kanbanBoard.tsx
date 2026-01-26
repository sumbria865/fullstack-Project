import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  DndContext,
  closestCorners,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import api from "../services/api";

/* ---------- Types ---------- */
type Status = "TODO" | "IN_PROGRESS" | "DONE";

type Ticket = {
  id: string;
  title: string;
  status: Status;
  priority: "LOW" | "MEDIUM" | "HIGH";
};

/* ---------- Main ---------- */
export default function KanbanBoard() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;

    api
      .get("/tickets", { params: { projectId } }) // ✅ FIX
      .then((res) => setTickets(res.data))
      .catch(() => alert("Failed to load tickets"))
      .finally(() => setLoading(false));
  }, [projectId]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const ticketId = active.id as string;
    const newStatus = over.id as Status;

    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId ? { ...t, status: newStatus } : t
      )
    );

    try {
      await api.patch(`/tickets/${ticketId}`, {
        status: newStatus,
      });
    } catch {
      alert("Failed to update ticket status");
    }
  };

  const byStatus = (status: Status) =>
    tickets.filter((t) => t.status === status);

  if (loading) {
    return <p className="p-6 text-center">Loading Kanban...</p>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Kanban Board</h1>
        <button
          onClick={() => navigate(`/projects/${projectId}/tickets`)}
          className="text-blue-600 hover:underline"
        >
          ← Back to Tickets
        </button>
      </div>

      <DndContext
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Column id="TODO" title="TODO" tickets={byStatus("TODO")} />
          <Column
            id="IN_PROGRESS"
            title="IN PROGRESS"
            tickets={byStatus("IN_PROGRESS")}
          />
          <Column id="DONE" title="DONE" tickets={byStatus("DONE")} />
        </div>
      </DndContext>
    </div>
  );
}

/* ---------- Column ---------- */
function Column({
  id,
  title,
  tickets,
}: {
  id: Status;
  title: string;
  tickets: Ticket[];
}) {
  return (
    <SortableContext
      id={id}
      items={tickets.map((t) => t.id)}
      strategy={verticalListSortingStrategy}
    >
      <div className="bg-slate-100 rounded-xl p-4 min-h-[400px]">
        <h2 className="font-semibold mb-4">{title}</h2>

        <div className="space-y-3">
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}

          {tickets.length === 0 && (
            <p className="text-sm text-gray-400">No tickets</p>
          )}
        </div>
      </div>
    </SortableContext>
  );
}

/* ---------- Ticket Card ---------- */
function TicketCard({ ticket }: { ticket: Ticket }) {
  const navigate = useNavigate();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: ticket.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => navigate(`/tickets/${ticket.id}`)}
      className="bg-white rounded-lg p-3 shadow cursor-pointer hover:shadow-md"
    >
      <h3 className="font-medium">{ticket.title}</h3>
      <span className="text-xs text-gray-500">{ticket.priority}</span>
    </div>
  );
}
