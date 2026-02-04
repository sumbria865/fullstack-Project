import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../prisma";
import { ObjectId } from "bson";

/* =====================
   AUTH / PROTECT
===================== */

export const protect = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  // ❌ No token
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const token = authHeader.split(" ")[1];

    // ✅ Decode token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { id: string };

    // ✅ Validate Mongo ObjectId
    if (!decoded?.id || !ObjectId.isValid(decoded.id)) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // ✅ Fetch user from DB
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // ✅ Attach user to request
    req.user = user;

    next();
  } catch (error) {
    console.error("JWT error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

/* =====================
   ROLE-BASED ACCESS
===================== */

export const authorizeRoles = (...roles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role: ${roles.join(", ")}`,
      });
      
    }

    next();
  };
};
