import { UserRole } from "@prisma/client";
import jwt, { SignOptions } from "jsonwebtoken";
import { Types } from "mongoose"; // ✅ for ObjectId validation

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
}

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

/* =========================
   TOKEN GENERATOR
   ========================= */
export const generateToken = (payload: JwtPayload): string => {
  // 🔥 HARD VALIDATION (CRITICAL)
  if (!payload.id || !Types.ObjectId.isValid(payload.id)) {
    throw new Error(`Invalid user id in JWT payload: ${payload.id}`);
  }

  const options: SignOptions = {
    expiresIn: "1d",
  };

  return jwt.sign(
    {
      id: payload.id,       // ✅ guaranteed ObjectId
      email: payload.email,
      role: payload.role,
    },
    JWT_SECRET,
    options
  );
};
