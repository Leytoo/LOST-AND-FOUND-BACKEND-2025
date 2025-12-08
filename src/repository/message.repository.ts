import { prisma } from "../prisma/client";

export const messageRepository = {
  create: (data: { conversationId: string; senderId: string; content: string }) => {
    return prisma.message.create({
      data,
      include: { sender: { select: { id: true, name: true } } },
    });
  },

  findByConversationId: (conversationId: string) => {
    return prisma.message.findMany({
      where: { conversationId },
      include: { sender: { select: { id: true, name: true } } },
      orderBy: { createdAt: "asc" },
    });
  },
};
