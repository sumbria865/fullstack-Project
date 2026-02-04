import { Request, Response } from "express";
import prisma from "../prisma";
import { TicketStatus, TicketPriority } from "@prisma/client";
import { ObjectId } from "bson";

/* =====================================================
   GET ALL TICKETS
   ADMIN → all / filter by project
   MANAGER → assigned only
===================================================== */
export const getTicketsByProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.query;
    const user = req.user as { id: string; role: string };

    let whereClause: any = {};

    // ✅ ADMIN
    if (user.role === "ADMIN") {
      if (projectId) {
        if (!ObjectId.isValid(String(projectId))) {
          return res.status(400).json({ message: "Invalid projectId" });
        }
        whereClause.projectId = String(projectId);
      }
    }

    // ✅ MANAGER
    if (user.role === "MANAGER") {
      whereClause.assigneeId = user.id;
    }

    const tickets = await prisma.ticket.findMany({
      where: whereClause,
      include: {
        assignee: { select: { id: true, name: true, role: true } },
        project: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json(tickets);
  } catch (error) {
    console.error("getTicketsByProject error:", error);
    return res.status(500).json({ message: "Failed to load tickets" });
  }
};

/* =====================================================
   CREATE TICKET
   ADMIN ONLY
===================================================== */
export const createTicket = async (req: Request, res: Response) => {
  try {
    const { title, description, priority, projectId, assigneeId } = req.body;

    if (!title || !projectId) {
      return res
        .status(400)
        .json({ message: "Title and projectId are required" });
    }

    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        projectId,
        priority: priority ?? TicketPriority.MEDIUM,
        status: TicketStatus.TODO,
        assigneeId: assigneeId ?? null,
      },
    });

    return res.status(201).json(ticket);
  } catch (error) {
    console.error("createTicket error:", error);
    return res.status(500).json({ message: "Failed to create ticket" });
  }
};

/* =====================================================
   ASSIGN TICKET
   ADMIN & MANAGER
===================================================== */
export const assignTicket = async (req: Request, res: Response) => {
  try {
    const { ticketId, userId } = req.body;

    const ticket = await prisma.ticket.update({
      where: { id: ticketId },
      data: { assigneeId: userId },
    });

    return res.status(200).json(ticket);
  } catch (error) {
    console.error("assignTicket error:", error);
    return res.status(500).json({ message: "Failed to assign ticket" });
  }
};

/* =====================================================
   GET SINGLE TICKET
===================================================== */
export const getTicketById = async (req: Request, res: Response) => {
  try {
    const { ticketId } = req.params;
    const user = req.user as { id: string; role: string };

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        assignee: {
          select: { id: true, name: true, role: true, email: true },
        },
        project: { select: { id: true, name: true } },
      },
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (user.role === "USER" && ticket.assigneeId !== user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    return res.status(200).json(ticket);
  } catch (error) {
    console.error("getTicketById error:", error);
    return res.status(500).json({ message: "Failed to fetch ticket" });
  }
};

/* =====================================================
   UPDATE TICKET STATUS
===================================================== */
export const updateTicketStatus = async (req: Request, res: Response) => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;

    const updatedTicket = await prisma.ticket.update({
      where: { id: ticketId },
      data: { status },
    });

    return res.status(200).json(updatedTicket);
  } catch (error) {
    console.error("updateTicketStatus error:", error);
    return res
      .status(500)
      .json({ message: "Failed to update ticket status" });
  }
};

/* =====================================================
   GET MY TICKETS
   USER ONLY ✅
===================================================== */
export const getMyTickets = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = req.user as { id: string; role: string };

    if (user.role !== "USER") {
      return res.status(403).json({ message: "Access denied" });
    }

    const tickets = await prisma.ticket.findMany({
      where: { assigneeId: user.id },
      include: {
        assignee: { select: { id: true, name: true, role: true } },
        project: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json(tickets);
  } catch (error) {
    console.error("getMyTickets error:", error);
    return res
      .status(500)
      .json({ message: "Failed to load user tickets" });
  }
};

/* =====================================================
   UPDATE MY TICKET STATUS
   USER ONLY ✅
===================================================== */
export const updateMyTicketStatus = async (req: Request, res: Response) => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;
    const user = req.user as { id: string; role: string };

    const ticket = await prisma.ticket.findFirst({
      where: { id: ticketId, assigneeId: user.id },
    });

    if (!ticket) {
      return res.status(403).json({ message: "Ticket not assigned to you" });
    }

    const updated = await prisma.ticket.update({
      where: { id: ticketId },
      data: { status },
    });

    return res.status(200).json(updated);
  } catch (error) {
    console.error("updateMyTicketStatus error:", error);
    return res
      .status(500)
      .json({ message: "Failed to update ticket status" });
  }
};
