import { prisma } from "../prisma/client";

export const conversationRepository = {
  create: (data: { userId: string; foundItemId: string; subject: string }) => {
    return prisma.conversation.create({
      data,
      include: {
        messages: { orderBy: { createdAt: "asc" } },
        user: { select: { id: true, name: true, studentId: true } },
      },
    });
  },

  findByUserAndItem: (userId: string, foundItemId: string) => {
    return prisma.conversation.findFirst({
      where: { userId, foundItemId },
      include: {
        messages: { orderBy: { createdAt: "asc" } },
        user: { select: { id: true, name: true, studentId: true } },
      },
    });
  },

  findByUserId: (userId: string) => {
    return prisma.conversation.findMany({
      where: { userId },
      include: {
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
        user: { select: { id: true, name: true, studentId: true } },
      },
      orderBy: { updatedAt: "desc" },
    });
  },

  findAll: () => {
    return prisma.conversation.findMany({
      include: {
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
        user: { select: { id: true, name: true, studentId: true } },
      },
      orderBy: { updatedAt: "desc" },
    });
  },

  findById: (id: string) => {
    return prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: { orderBy: { createdAt: "asc" } },
        user: { select: { id: true, name: true, studentId: true } },
      },
    });
  },

  updateStatus: (id: string, status: string) => {
    return prisma.conversation.update({
      where: { id },
      data: { status },
      include: {
        messages: { orderBy: { createdAt: "asc" } },
        user: { select: { id: true, name: true, studentId: true } },
      },
    });
  },
};
