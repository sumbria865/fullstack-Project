import mongoose, { Schema, Document } from "mongoose";

export type TicketStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type TicketPriority = "HIGH" | "MEDIUM" | "LOW";

export interface TicketDocument extends Document {
  title: string;
  description?: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignee?: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ticketSchema = new Schema<TicketDocument>(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    status: {
      type: String,
      enum: ["TODO", "IN_PROGRESS", "DONE"],
      default: "TODO",
    },

    priority: {
      type: String,
      enum: ["HIGH", "MEDIUM", "LOW"],
      default: "MEDIUM",
    },

    // ✅ ASSIGNED USER
    assignee: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<TicketDocument>("Ticket", ticketSchema);
