import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service";

/**
 * Register Controller
 */
export const register = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name, email, password, role } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const allowedRoles = ["USER", "MANAGER", "ADMIN"];
    const finalRole = allowedRoles.includes(role) ? role : "USER";

    const { user, token } = await registerUser(name, email, password, finalRole);

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ message: error.message || "Registration failed" });
  }
};

/**
 * Login Controller
 */
export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const { user, token } = await loginUser(email, password);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error(error);
    return res.status(401).json({ message: error.message || "Invalid credentials" });
  }
};
