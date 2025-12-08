import { prisma } from "../prisma/client";

export const authRepository = {
  findByEmail: (email: string) => {
    return prisma.user.findUnique({
      where: { email }
    });
  },

  createUser: (email: string, name: string, hashedPassword: string) => {
    return prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      }
    });
  }
};
