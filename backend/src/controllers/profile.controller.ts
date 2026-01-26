import { Request, Response } from "express";
import prisma from "../prisma/client";

/* ---------------- GET PROFILE ---------------- */
export const getMyProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Failed to load profile" });
  }
};

/* ---------------- UPDATE PROFILE ---------------- */
export const updateMyProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};
