import prisma from "../prisma";
import { hashPassword, comparePassword } from "../utils/password";
import { generateToken } from "../utils/jwt";

/**
 * Register a new user
 * @param name user's name
 * @param email user's email
 * @param password plain text password
 */
export const registerUser = async (
  name: string | undefined,
  email: string,
  password: string
) => {
  // 1. Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new Error("User already exists with this email");
  }

  // 2. Hash password for security
  const hashedPassword = await hashPassword(password);

  // 3. Save user to database
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword
    }
  });

  // 4. Generate JWT token
  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role
  });

  // 5. Return user data + token
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    token
  };
};

/**
 * Login existing user
 * @param email user email
 * @param password plain password
 */
export const loginUser = async (email: string, password: string) => {
  // 1. Find user
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // 2. Compare passwords
  const isPasswordCorrect = await comparePassword(password, user.password);

  if (!isPasswordCorrect) {
    throw new Error("Invalid email or password");
  }

  // 3. Generate token
  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role
  });

  // 4. Return safe user data
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    token
  };
};