import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const email = "your@email.com";
  const plainPassword = "Test1234"; // 🔹 the password you will use to login

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const updatedUser = await prisma.user.update({
    where: { email },
    data: { 
      role: UserRole.ADMIN,
      password: hashedPassword, // 🔹 set a known password
    },
  });

  console.log("Updated user:", updatedUser);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
