import prisma from "../prisma";

/**
 * Get user by ID
 */
export const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    }
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

/**
 * Update user profile
 */
export const updateUserProfile = async (
  userId: string,
  name: string | undefined
) => {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true
    }
  });

  return updatedUser;
};

/**
 * Get all users (admin feature)
 */
export const getAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    }
  });
};