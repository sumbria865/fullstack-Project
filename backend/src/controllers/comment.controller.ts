import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * POST /tickets/:ticketId/comments
 */
export const createComment = async (req: any, res: Response) => {
  try {
    const { ticketId } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment text required" });
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
  } catch (err) {
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
  const { ticketId } = req.params;

  const comments = await prisma.comment.findMany({
    where: { ticketId },
    include: {
      user: {
        select: { name: true, email: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  res.json(comments);
};

export const addComment = async (
  req: any,
  res: Response
) => {
  const { ticketId } = req.params;
  const { text } = req.body;

  const comment = await prisma.comment.create({
    data: {
      text,
      ticketId,
      userId: req.user.id,
    },
    include: {
      user: {
        select: { name: true, email: true },
      },
    },
  });

  res.status(201).json(comment);
};
