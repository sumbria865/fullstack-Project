import { Request, Response } from "express";
import prisma from "../prisma";

/* =========================
   GET PROJECTS
   ========================= */
export const getProjects = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId: string = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { memberIds: { has: userId } },
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(projects);
  } catch (error) {
    console.error("GET PROJECTS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

/* =========================
   CREATE PROJECT
   ========================= */
export const createProject = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const { id: userId, role: userRole } = req.user;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Only ADMIN or MANAGER can create projects
    if (!["ADMIN", "MANAGER"].includes(userRole)) {
      return res.status(403).json({ message: "Forbidden: Insufficient role" });
    }

    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Project name is required" });
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        ownerId: userId,
        memberIds: [userId],
      },
    });

    res.status(201).json(project);
  } catch (error) {
    console.error("CREATE PROJECT ERROR:", error);
    res.status(500).json({ message: "Failed to create project" });
  }
};

/* =========================
   DELETE PROJECT
   ========================= */
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id: projectId } = req.params;

    // @ts-ignore
    const userId: string = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Only owner can delete
    if (project.ownerId !== userId) {
      return res.status(403).json({ message: "Forbidden: Not the owner" });
    }

    // Delete related comments
    const tickets = await prisma.ticket.findMany({
      where: { projectId },
      select: { id: true },
    });

    const ticketIds = tickets.map((t) => t.id);

    await prisma.comment.deleteMany({
      where: { ticketId: { in: ticketIds } },
    });

    // Delete tickets
    await prisma.ticket.deleteMany({
      where: { projectId },
    });

    // Delete project
    await prisma.project.delete({
      where: { id: projectId },
    });

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("DELETE PROJECT ERROR:", error);
    res.status(500).json({ message: "Failed to delete project" });
  }
};
