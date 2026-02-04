// components/kanban/Column.tsx
import TicketCard from "./TicketCard";
import { Ticket, TicketStatus } from "./types";

export default function Column({ title, tickets }: { title: TicketStatus; tickets: Ticket[] }) {
  return (
    <div className="bg-gray-100 rounded-xl p-4 space-y-4 min-h-[300px]">
      <h2 className="font-semibold text-lg">{title}</h2>
      {tickets.map((ticket) => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
}
