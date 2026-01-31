import { Request, Response } from "express";
import prisma from "../prisma";
import { TicketStatus, TicketPriority } from "@prisma/client";
import { ObjectId } from "bson";

/* =====================================================
   GET ALL TICKETS (OPTIONAL projectId)
===================================================== */
export const getTicketsByProject = async (
  req: Request,
  res: Response
) => {
  try {
    const { projectId } = req.query;

    // ✅ Validate projectId (Mongo ObjectId)
    if (projectId && !ObjectId.isValid(String(projectId))) {
      return res.status(400).json({
        message: "Invalid projectId",
      });
    }

    const tickets = await prisma.ticket.findMany({
      where: projectId
        ? { projectId: String(projectId) }
        : {},
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(tickets);
  } catch (error) {
    console.error("getTicketsByProject error:", error);
    res.status(500).json({ message: "Failed to load tickets" });
  }
};

/* =====================================================
   CREATE TICKET
===================================================== */
export const createTicket = async (
  req: Request,
  res: Response
) => {
  try {
    const { title, description, priority, projectId } = req.body;

    if (!title || !projectId) {
      return res.status(400).json({
        message: "Title and projectId are required",
      });
    }

    // ✅ Validate projectId
    if (!ObjectId.isValid(projectId)) {
      return res.status(400).json({
        message: "Invalid projectId",
      });
    }

    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        projectId,
        priority: priority ?? TicketPriority.MEDIUM,
        status: TicketStatus.TODO,
      },
    });

    res.status(201).json(ticket);
  } catch (error) {
    console.error("createTicket error:", error);
    res.status(500).json({ message: "Failed to create ticket" });
  }
};

/* =====================================================
   GET SINGLE TICKET BY ID
===================================================== */
export const getTicketById = async (
  req: Request,
  res: Response
) => {
  try {
    const { ticketId } = req.params;

    // ✅ Validate ticketId
    if (!ObjectId.isValid(ticketId)) {
      return res.status(400).json({
        message: "Invalid ticketId",
      });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        assignee: true,
        comments: true,
      },
    });

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    res.status(200).json(ticket);
  } catch (error) {
    console.error("getTicketById error:", error);
    res.status(500).json({ message: "Failed to fetch ticket" });
  }
};

/* =====================================================
   UPDATE TICKET STATUS
===================================================== */
export const updateTicketStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;

    // ✅ Validate ticketId
    if (!ObjectId.isValid(ticketId)) {
      return res.status(400).json({
        message: "Invalid ticketId",
      });
    }

    // ✅ Validate status enum
    if (!Object.values(TicketStatus).includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Use TODO | IN_PROGRESS | DONE",
      });
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        status: status as TicketStatus,
      },
    });

    res.status(200).json(updatedTicket);
  } catch (error) {
    console.error("updateTicketStatus error:", error);
    res.status(500).json({ message: "Failed to update ticket status" });
  }
};
