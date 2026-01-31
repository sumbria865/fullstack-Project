import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service";

/**
 * Register Controller
 */
export const register = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Create user
    const { user, token } = await registerUser(name, email, password);

    // ✅ Return ONLY safe fields (RBAC needs role)
    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role, // 🔥 REQUIRED FOR RBAC
      },
    });
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({
      message: error.message || "Registration failed",
    });
  }
};

/**
 * Login Controller
 */
export const login = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const { user, token } = await loginUser(email, password);

    // ✅ Consistent RBAC-friendly response
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role, // 🔥 REQUIRED
      },
    });
  } catch (error: any) {
    console.error(error);
    return res.status(401).json({
      message: error.message || "Invalid credentials",
    });
  }
};
