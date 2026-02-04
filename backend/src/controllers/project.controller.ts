import { Request, Response } from "express";
import prisma from "../prisma";

/* =========================
   GET PROJECTS
   ADMIN → owned projects
   MANAGER → member OR assigned ticket
   USER → assigned ticket
========================= */
export const getProjects = async (req: any, res: Response) => {
  try {
    const { id: userId, role } = req.user;

    if (role === "ADMIN") {
      const projects = await prisma.project.findMany({
        where: { ownerId: userId },
        orderBy: { createdAt: "desc" },
      });
      return res.json(projects);
    }

    if (role === "MANAGER") {
      const projects = await prisma.project.findMany({
        where: {
          OR: [
            { memberIds: { has: userId } },
            { tickets: { some: { assigneeId: userId } } },
          ],
        },
        distinct: ["id"],
        orderBy: { createdAt: "desc" },
      });

      return res.json(projects);
    }

    const projects = await prisma.project.findMany({
      where: {
        tickets: {
          some: { assigneeId: userId },
        },
      },
      distinct: ["id"],
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
   ADMIN ONLY
========================= */
export const createProject = async (req: any, res: Response) => {
  try {
    const { id: userId, role } = req.user;

    if (role !== "ADMIN") {
      return res.status(403).json({ message: "Only ADMIN can create projects" });
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
        memberIds: [],
      },
    });

    res.status(201).json(project);
  } catch (error) {
    console.error("CREATE PROJECT ERROR:", error);
    res.status(500).json({ message: "Failed to create project" });
  }
};

/* =========================
   ASSIGN PROJECT TO MANAGER
   ADMIN ONLY
========================= */
export const assignProjectToManager = async (req: any, res: Response) => {
  try {
    const { role } = req.user;
    const { projectId, managerId } = req.body;

    if (role !== "ADMIN") {
      return res.status(403).json({ message: "Only ADMIN can assign projects" });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const manager = await prisma.user.findUnique({
      where: { id: managerId },
    });

    if (!manager || manager.role !== "MANAGER") {
      return res.status(400).json({ message: "Invalid manager" });
    }

    if (project.memberIds.includes(managerId)) {
      return res.status(400).json({ message: "Manager already assigned" });
    }

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        memberIds: { push: managerId },
      },
    });

    res.json({
      message: "Project assigned to manager successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error("ASSIGN PROJECT ERROR:", error);
    res.status(500).json({ message: "Failed to assign project" });
  }
};

/* =========================
   DELETE PROJECT
   ADMIN ONLY
========================= */
export const deleteProject = async (req: any, res: Response) => {
  try {
    const { role } = req.user;
    const { id: projectId } = req.params;

    if (role !== "ADMIN") {
      return res.status(403).json({ message: "Only ADMIN can delete projects" });
    }

    const tickets = await prisma.ticket.findMany({
      where: { projectId },
      select: { id: true },
    });

    const ticketIds = tickets.map((t) => t.id);

    await prisma.comment.deleteMany({
      where: { ticketId: { in: ticketIds } },
    });

    await prisma.ticket.deleteMany({
      where: { projectId },
    });

    await prisma.project.delete({
      where: { id: projectId },
    });

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("DELETE PROJECT ERROR:", error);
    res.status(500).json({ message: "Failed to delete project" });
  }
};

/* =========================
   GET PROJECT USERS
   ADMIN / MANAGER
========================= */
export const getProjectUsers = async (req: any, res: Response) => {
  try {
    const { id: projectId } = req.params;

    // 1️⃣ Get project
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { memberIds: true },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // 2️⃣ Get users who have tickets in this project
    const ticketUsers = await prisma.ticket.findMany({
      where: { projectId },
      select: {
        assignee: {
          select: { id: true, name: true },
        },
      },
    });

    // 3️⃣ Merge memberIds + ticket assignees
    const userIds = new Set<string>();

    project.memberIds.forEach((id) => userIds.add(id));
    ticketUsers.forEach((t) => {
      if (t.assignee?.id) userIds.add(t.assignee.id);
    });

    // 4️⃣ Fetch users EXCEPT ADMIN
    const users = await prisma.user.findMany({
      where: {
        id: { in: Array.from(userIds) },
        role: { in: ["MANAGER", "USER"] }, // 🔥 CRITICAL FIX
      },
      select: {
        id: true,
        name: true,
      },
    });

    res.json(users);
  } catch (error) {
    console.error("GET PROJECT USERS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch project users" });
  }
};
