import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service";

/**
 * Register Controller
 */
export const register = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const { name, email, password } = req.body;
    console.log("nmae",name);
    
    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Call service to create user and generate JWT
    const { user, token } = await registerUser(name, email, password);

    return res.status(201).json({
      message: "User registered successfully",
      user,
      token,
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
export const login = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const { email, password } = req.body;
    

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Call service to verify user and generate JWT
    const { user, token } = await loginUser(email, password);

    return res.status(200).json({
      message: "Login successful",
      user,
      token,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(401).json({
      message: error.message || "Invalid credentials",
    });
  }
};