import { Router, Request, Response } from "express";
import prisma from "../prisma";
import { protect } from "../middlewares/auth.middleware";
import { UserRole } from "@prisma/client";

const router = Router();

/**
 * 🔥 DEV ONLY
 * Make currently logged-in user ADMIN
 */
router.post("/make-me-admin", protect, async (req: any, res: Response) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { role: UserRole.ADMIN },
    });

    return res.status(200).json({
      message: "✅ You are ADMIN now",
      user,
    });
  } catch (error) {
    console.error("Make admin failed:", error);
    return res.status(500).json({
      message: "Failed to update role",
    });
  }
});

export default router;
