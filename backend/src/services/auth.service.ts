import prisma from "../prisma";
import { hashPassword, comparePassword } from "../utils/password";
import { generateToken } from "../utils/jwt";

/**
 * Register a new user
 */
export const registerUser = async (
  name: string | undefined,
  email: string,
  password: string
) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User already exists with this email");
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      activityDays: [], // ✅ IMPORTANT
    },
  });

  // ✅ JWT MUST CONTAIN id
const token = generateToken({
  id: user.id,
  email: user.email,
  role: user.role, // ✅ REQUIRED
});


  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

/**
 * Login existing user
 */
export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordCorrect = await comparePassword(password, user.password);

  if (!isPasswordCorrect) {
    throw new Error("Invalid email or password");
  }

 const token = generateToken({
  id: user.id,
  email: user.email,
  role: user.role, // ✅ REQUIRED

});
console.log("Jwt token is",token);


  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};
