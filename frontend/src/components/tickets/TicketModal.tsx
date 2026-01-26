import { X } from "lucide-react";

export default function TicketModal({
  ticket,
  onClose,
}: {
  ticket: any;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
      <div className="bg-white w-full max-w-xl rounded-xl shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{ticket.title}</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-4">
          {ticket.description || "No description"}
        </p>

        {/* Meta */}
        <div className="flex gap-4 text-sm">
          <span>Priority: {ticket.priority}</span>
          <span>Status: {ticket.status}</span>
        </div>
      </div>
    </div>
  );
}
