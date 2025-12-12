"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageRepository = void 0;
const client_1 = require("../prisma/client");
exports.messageRepository = {
    create: (data) => {
        return client_1.prisma.message.create({
            data,
            include: { sender: { select: { id: true, name: true } } },
        });
    },
    findByConversationId: async (conversationId) => {
        const conversation = await client_1.prisma.conversation.findUnique({
            where: { id: conversationId },
            select: { userId: true },
        });
        if (!conversation)
            return [];
        const messages = await client_1.prisma.message.findMany({
            where: { conversationId },
            include: { sender: { select: { id: true, name: true } } },
            orderBy: { createdAt: "asc" },
        });
        return messages.map((msg) => ({
            ...msg,
            senderType: msg.senderId === conversation.userId ? "user" : "admin",
        }));
    },
    deleteByConversationId: (conversationId) => {
        return client_1.prisma.message.deleteMany({
            where: { conversationId },
        });
    },
};
