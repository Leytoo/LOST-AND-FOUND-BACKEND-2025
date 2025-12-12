import { prisma } from "../prisma/client";

export const messageRepository = {
  create: (data: { conversationId: string; senderId: string; content: string }) => {
    return prisma.message.create({
      data,
      include: { sender: { select: { id: true, name: true } } },
    });
  },

  findByConversationId: async (conversationId: string) => {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { userId: true },
    });

    if (!conversation) return [];

    const messages = await prisma.message.findMany({
      where: { conversationId },
      include: { sender: { select: { id: true, name: true } } },
      orderBy: { createdAt: "asc" },
    });

    return messages.map((msg) => ({
      ...msg,
      senderType: msg.senderId === conversation.userId ? "user" : "admin",
    }));
  },

  deleteByConversationId: (conversationId: string) => {
    return prisma.message.deleteMany({
      where: { conversationId },
    });
  },
};