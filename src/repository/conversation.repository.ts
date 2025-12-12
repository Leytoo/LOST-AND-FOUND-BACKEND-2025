import { prisma } from "../prisma/client";

export const conversationRepository = {
  create: (data: { userId: string; foundItemId: string; subject: string }) => {
    return prisma.conversation.create({
      data,
      include: {
        messages: { 
          include: { sender: { select: { id: true, name: true } } },
          orderBy: { createdAt: "asc" } 
        },
        user: { select: { id: true, name: true, studentId: true } },
        foundItem: { select: { id: true, title: true, location: true, user: { select: { id: true, name: true } } } },
      },
    });
  },

  findByUserAndItem: (userId: string, foundItemId: string) => {
    return prisma.conversation.findFirst({
      where: { userId, foundItemId },
      include: {
        messages: { 
          include: { sender: { select: { id: true, name: true } } },
          orderBy: { createdAt: "asc" } 
        },
        user: { select: { id: true, name: true, studentId: true } },
        foundItem: { select: { id: true, title: true, location: true, user: { select: { id: true, name: true } } } },
      },
    });
  },

  findByUserId: (userId: string) => {
    return prisma.conversation.findMany({
      where: { userId },
      include: {
        messages: { 
          include: { sender: { select: { id: true, name: true } } },
          orderBy: { createdAt: "desc" }, 
          take: 1 
        },
        user: { select: { id: true, name: true, studentId: true } },
        foundItem: { select: { id: true, title: true, location: true, user: { select: { id: true, name: true } } } },
      },
      orderBy: { updatedAt: "desc" },
    });
  },

  findAll: () => {
    return prisma.conversation.findMany({
      include: {
        messages: {
          include: { sender: { select: { id: true, name: true } } },
          orderBy: { createdAt: "asc" },
        },
        user: { select: { id: true, name: true, studentId: true } },
        foundItem: { select: { id: true, title: true, location: true, user: { select: { id: true, name: true } } } },
      },
      orderBy: { updatedAt: "desc" },
    });
  },

  findById: (id: string) => {
    return prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: { 
          include: { sender: { select: { id: true, name: true } } },
          orderBy: { createdAt: "asc" } 
        },
        user: { select: { id: true, name: true, studentId: true } },
        foundItem: { select: { id: true, title: true, location: true, user: { select: { id: true, name: true } } } },
      },
    });
  },

  updateStatus: (id: string, status: string) => {
    return prisma.conversation.update({
      where: { id },
      data: { status },
      include: {
        messages: { 
          include: { sender: { select: { id: true, name: true } } },
          orderBy: { createdAt: "asc" } 
        },
        user: { select: { id: true, name: true, studentId: true } },
        foundItem: { select: { id: true, title: true, location: true, user: { select: { id: true, name: true } } } },
      },
    });
  },

  delete: (id: string) => {
    return prisma.conversation.delete({
      where: { id },
    });
  },
};