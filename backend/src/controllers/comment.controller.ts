import { Request, Response } from "express";
import prisma from "../prisma";

/**
 * POST /tickets/:ticketId/comments
 */
export const createComment = async (req: any, res: Response) => {
  try {
    const { ticketId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const comment = await prisma.comment.create({
      data: {
        text,
        ticketId,
        userId: req.user.id,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error("Create comment error:", error);
    res.status(500).json({ message: "Failed to create comment" });
  }
};

/**
 * GET /tickets/:ticketId/comments
 */
export const getCommentsByTicket = async (
  req: any,
  res: Response
) => {
  try {
    const { ticketId } = req.params;

    const comments = await prisma.comment.findMany({
      where: { ticketId },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    res.json(comments);
  } catch (error) {
    console.error("Get comments error:", error);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
};

export const addComment = async (
  req: any,
  res: Response
) => {
  try {
    const { ticketId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const comment = await prisma.comment.create({
      data: {
        text,
        ticketId,
        userId: req.user.id,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({ message: "Failed to create comment" });
  }
};
