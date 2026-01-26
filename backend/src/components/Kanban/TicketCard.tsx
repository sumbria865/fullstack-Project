// components/kanban/TicketCard.tsx
import { Ticket } from "./types";

const priorityStyles = {
  HIGH: "bg-red-100 text-red-600",
  MEDIUM: "bg-yellow-100 text-yellow-600",
  LOW: "bg-green-100 text-green-600",
};

export default function TicketCard({ ticket }: { ticket: Ticket }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition border border-slate-200">
      <h3 className="font-medium">{ticket.title}</h3>
      <div className="flex justify-between items-center mt-3 text-xs">
        <span className={`px-2 py-1 rounded-full font-medium ${priorityStyles[ticket.priority]}`}>
          {ticket.priority}
        </span>
        <span className="text-gray-500">{ticket.assignee?.name || "Unassigned"}</span>
      </div>
    </div>
  );
}
