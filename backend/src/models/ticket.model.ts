export type TicketStatus = "TODO" | "IN_PROGRESS" | "DONE";

const ticketSchema = new Schema({
  title: String,
  description: String,
  status: {
    type: String,
    enum: ["TODO", "IN_PROGRESS", "DONE"],
    default: "TODO",
  },
  priority: {
    type: String,
    enum: ["HIGH", "MEDIUM", "LOW"],
  },
  assignee: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: "Project",
  },
});
