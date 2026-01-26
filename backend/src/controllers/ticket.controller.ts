import { Request, Response } from "express";
import prisma from "../prisma";

/* ---------- GET TICKETS BY PROJECT ---------- */
export const getTicketsByProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.query;

    if (!projectId) {
      return res.status(400).json({ message: "projectId is required" });
    }

    const tickets = await prisma.ticket.findMany({
      where: { projectId: projectId as string },
      include: {
        assignee: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tickets" });
  }
};

/* ---------- CREATE TICKET ---------- */
export const createTicket = async (req: Request, res: Response) => {
  try {
    const { title, description, priority, projectId } = req.body;

    // @ts-ignore
    const userId = req.user.id;

    if (!title || !projectId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        priority,
        projectId,
        assigneeId: userId,
      },
    });

    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Failed to create ticket" });
  }
};

/* ---------- GET SINGLE TICKET ---------- */
export const getTicketById = async (req: Request, res: Response) => {
  try {
    const { ticketId } = req.params;

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        assignee: { select: { name: true } },
        comments: true,
      },
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch ticket" });
  }
};
