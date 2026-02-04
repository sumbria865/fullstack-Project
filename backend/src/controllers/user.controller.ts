import { Request, Response } from "express";
import prisma from "../prisma";
import { hashPassword, comparePassword } from "../utils/password";

/* ======================
   GET LOGGED-IN USER
   ====================== */
export const getProfile = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        location: true,
        bio: true,
        activityDays: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Failed to load profile" });
  }
};

/* ======================
   UPDATE PROFILE
   ====================== */
export const updateProfile = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user.id;

    const { name, phone, location, bio } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        phone,
        location,
        bio,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        location: true,
        bio: true,
      },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

/* ======================
   CHANGE EMAIL
   ====================== */
export const changeEmail = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user.id;

    let { newEmail, password } = req.body;

    if (!newEmail || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    newEmail = String(newEmail).trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If same email, nothing to do
    if (user.email === newEmail) {
      return res.status(200).json({ message: "Email unchanged" });
    }

    const validPassword = await comparePassword(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const emailExists = await prisma.user.findUnique({
      where: { email: newEmail },
    });

    // Allow if the only match is the same user
    if (emailExists && emailExists.id !== userId) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { email: newEmail },
    });

    res.status(200).json({ message: "Email updated successfully", email: updated.email });
  } catch (error) {
    console.error("Change email error:", error);
    res.status(500).json({ message: "Failed to change email" });
  }
};

/* ======================
   CHANGE PASSWORD
   ====================== */
export const changePassword = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user.id;

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Current and new password required" });
    }

    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const validPassword = await comparePassword(
      currentPassword,
      user.password
    );

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid current password" });
    }

    const hashed = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Failed to change password" });
  }
};

/* ======================
   GET ACTIVITY DAYS
   ====================== */
export const getActivity = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { activityDays: true },
    });

    res.status(200).json(user?.activityDays || []);
  } catch (error) {
    console.error("Get activity error:", error);
    res.status(500).json({ message: "Failed to fetch activity" });
  }
};

/* ======================
   TOGGLE ACTIVITY DAY
   ====================== */
export const toggleActivity = async (req: Request, res: Response) => {
  try {
    const { date } = req.body;

    if (!date) {
      return res.status(400).json({ message: "Date required" });
    }

    // @ts-ignore
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const days = user.activityDays || [];
    const updatedDays = days.includes(date)
      ? days.filter((d) => d !== date)
      : [...days, date];

    await prisma.user.update({
      where: { id: userId },
      data: { activityDays: updatedDays },
    });

    res.status(200).json(updatedDays);
  } catch (error) {
    console.error("Toggle activity error:", error);
    res.status(500).json({ message: "Failed to update activity" });
  }
};

/* ======================
   GET USERS FOR TICKET ASSIGN
   ADMIN / MANAGER
====================== */
export const getUsersForAssign = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: {
          in: ["MANAGER", "USER"],
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      orderBy: { name: "asc" },
    });

    res.status(200).json(users);
  } catch (error) {
    console.error("getUsersForAssign error:", error);
    res.status(500).json({ message: "Failed to load users" });
  }
};
