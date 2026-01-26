import { Request, Response } from "express";
import prisma from "../prisma";

/**
 * Get current logged-in user's profile
 * Route: GET /api/users/me
 */
export const getProfile = async (req: any, res: Response) => {
  try {
    // User id comes from JWT middleware
    const userId = req.user.id;

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Update current user's profile
 * Route: PUT /api/users/me
 */
export const updateProfile = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;

    // Update only allowed fields
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Update failed" });
  }
};