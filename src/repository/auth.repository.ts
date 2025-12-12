import { prisma } from "../prisma/client";

export const authRepository = {
  findByStudentId: (studentId: string) => {
    return prisma.user.findUnique({
      where: { studentId }
    });
  },

  createUser: (studentId: string, name: string, hashedPassword: string) => {
    return prisma.user.create({
      data: {
        studentId,
        name,
        password: hashedPassword,
      }
    });
  }
};  
