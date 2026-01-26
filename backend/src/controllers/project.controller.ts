import { Request, Response } from "express";
import prisma from "../prisma";

/* ================= CREATE PROJECT ================= */
export const createProject = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;

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
    console.error("Create project error:", error);
    res.status(500).json({ message: "Failed to create project" });
  }
};

/* ================= GET PROJECTS ================= */
export const getProjects = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const projects = await prisma.project.findMany({
      where: {
        memberIds: {
          has: userId,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(projects);
  } catch (error) {
    console.error("Get projects error:", error);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

/* ================= DELETE PROJECT ================= */
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.ownerId !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await prisma.project.delete({
      where: { id },
    });

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Delete project error:", error);
    res.status(500).json({ message: "Failed to delete project" });
  }
};
