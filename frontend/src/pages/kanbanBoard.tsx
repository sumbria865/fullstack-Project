import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  DndContext,
  closestCorners,
  DragEndEvent,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import api from "../services/api";
import React from "react";

/* ---------- Types ---------- */
type Status = "TODO" | "IN_PROGRESS" | "DONE";

type Ticket = {
  id: string;
  title: string;
  status: Status;
  priority: "LOW" | "MEDIUM" | "HIGH";
};

/* ---------- Status Styles ---------- */
const statusStyles: Record<Status, string> = {
  TODO: "border-blue-400 bg-blue-50",
  IN_PROGRESS: "border-yellow-400 bg-yellow-50",
  DONE: "border-green-400 bg-green-50",
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
      .get("/tickets", { params: { projectId } })
      .then((res) => setTickets(res.data))
      .catch(() => alert("Failed to load tickets"))
      .finally(() => setLoading(false));
  }, [projectId]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const ticketId = active.id as string;
    const newStatus = over.data.current?.status as Status;
    if (!newStatus) return;

    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId ? { ...t, status: newStatus } : t
      )
    );

    try {
      await api.patch(`/tickets/${ticketId}/status`, {
        status: newStatus,
      });
    } catch {
      alert("Failed to update ticket status");
    }
  };

  const byStatus = (status: Status) =>
    tickets.filter((t) => t.status === status);

  if (loading) {
    return (
      <p className="p-6 text-center text-gray-500">
        Loading Kanban Board...
      </p>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold">
          Kanban Board
        </h1>
        <button
          onClick={() => navigate(`/projects/${projectId}/tickets`)}
          className="text-sm md:text-base text-blue-600 hover:underline"
        >
          ← Back
        </button>
      </div>

      <DndContext
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Column
            id="TODO"
            title="TODO"
            tickets={byStatus("TODO")}
          />
          <Column
            id="IN_PROGRESS"
            title="IN PROGRESS"
            tickets={byStatus("IN_PROGRESS")}
          />
          <Column
            id="DONE"
            title="DONE"
            tickets={byStatus("DONE")}
          />
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
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: { status: id },
  });

  return (
    <SortableContext
      id={id}
      items={tickets.map((t) => t.id)}
      strategy={verticalListSortingStrategy}
    >
      <div
        ref={setNodeRef}
        className={`rounded-xl border-2 p-4 min-h-[420px] transition ${
          statusStyles[id]
        } ${isOver ? "ring-2 ring-black/20" : ""}`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-sm">
            {title}
          </h2>
          <span className="text-xs bg-white px-2 py-0.5 rounded-full shadow">
            {tickets.length}
          </span>
        </div>

        <div className="space-y-3">
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}

          {tickets.length === 0 && (
            <p className="text-xs text-gray-400 text-center mt-10">
              Drag tickets here
            </p>
          )}
        </div>
      </div>
    </SortableContext>
  );
}

/* ---------- Ticket Card ---------- */
function TicketCard({ ticket }: { ticket: Ticket }) {
  const navigate = useNavigate();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: ticket.id,
  });

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
      className={`bg-white rounded-lg p-3 shadow-sm border hover:shadow-md cursor-pointer transition ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <h3 className="font-medium text-sm truncate">
        {ticket.title}
      </h3>
      <span className="text-xs text-gray-500">
        Priority: {ticket.priority}
      </span>
    </div>
  );
}
