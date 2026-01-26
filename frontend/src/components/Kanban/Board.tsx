// components/kanban/Board.tsx
import { useState } from "react";
import Column from "./Column";
import { tickets as allTickets } from "./tickets";
import { TicketStatus } from "./types";

const columns: TicketStatus[] = ["TODO", "IN_PROGRESS", "DONE"];

export default function Board() {
  const [tickets] = useState(allTickets);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((col) => (
        <Column
          key={col}
          title={col}
          tickets={tickets.filter((t) => t.status === col)}
        />
      ))}
    </div>
  );
}
