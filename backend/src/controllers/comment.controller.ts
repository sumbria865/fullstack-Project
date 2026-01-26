import { Request, Response } from "express";
import prisma from "../prisma";

export const addComment = async (req: any, res: Response) => {
  const { ticketId, text } = req.body;

  const comment = await prisma.comment.create({
    data: {
      text,
      ticketId,
      userId: req.user.id,
    },
  });

  res.status(201).json(comment);
};

export const getComments = async (req: Request, res: Response) => {
  const { ticketId } = req.query;

  const comments = await prisma.comment.findMany({
    where: { ticketId: ticketId as string },
  });

  res.json(comments);
};