// src/utils/jwt.ts
import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export const generateToken = (payload: JwtPayload): string => {
  const options: SignOptions = {
    expiresIn: "1d", // ✅ HARD-CODED (NO TS ERROR)
  };

  return jwt.sign(payload, JWT_SECRET, options);
};