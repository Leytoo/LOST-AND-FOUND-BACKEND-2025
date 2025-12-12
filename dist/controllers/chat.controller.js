"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatController = void 0;
const chat_service_1 = require("../service/chat.service");
const pusher_config_1 = require("../config/pusher.config");
const client_1 = require("../prisma/client");
exports.chatController = {
    startConversation: async (req, res) => {
        try {
            const { foundItemId, subject } = req.body;
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            if (!foundItemId || !subject) {
                return res.status(400).json({ error: "Found item ID and subject are required" });
            }
            const conversation = await chat_service_1.chatService.startConversation(userId, foundItemId, subject);
            return res.status(201).json({
                message: "Conversation started",
                conversation,
            });
        }
        catch (err) {
            return res.status(400).json({ error: err.message });
        }
    },
    getConversation: async (req, res) => {
        try {
            const { conversationId } = req.params;
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            const conversation = await chat_service_1.chatService.getConversation(conversationId);
            return res.json({
                message: "Conversation retrieved",
                conversation,
            });
        }
        catch (err) {
            return res.status(404).json({ error: err.message });
        }
    },
    getUserConversations: async (req, res) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            const conversations = await chat_service_1.chatService.getUserConversations(userId);
            return res.json({
                message: "User conversations retrieved",
                conversations,
            });
        }
        catch (err) {
            return res.status(400).json({ error: err.message });
        }
    },
    getAdminConversations: async (req, res) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            const conversations = await chat_service_1.chatService.getAdminConversations();
            return res.json({
                message: "All conversations retrieved",
                conversations,
            });
        }
        catch (err) {
            return res.status(400).json({ error: err.message });
        }
    },
    sendMessage: async (req, res) => {
        try {
            const { conversationId, content } = req.body;
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            if (!conversationId || !content) {
                return res.status(400).json({ error: "Conversation ID and content are required" });
            }
            const conversation = await chat_service_1.chatService.getConversation(conversationId);
            const message = await client_1.prisma.message.create({
                data: {
                    conversationId,
                    senderId: userId,
                    content,
                },
                include: {
                    sender: {
                        select: {
                            id: true,
                            name: true,
                            isAdmin: true,
                        },
                    },
                },
            });
            const senderType = message.senderId === conversation.userId ? "user" : "admin";
            await pusher_config_1.pusher.trigger(`conversation-${conversationId}`, "message-sent", {
                id: message.id,
                conversationId: message.conversationId,
                senderId: message.senderId,
                content: message.content,
                createdAt: message.createdAt,
                senderType,
                sender: {
                    id: message.sender.id,
                    name: message.sender.name,
                    isAdmin: senderType === "admin",
                },
            });
            return res.status(201).json({
                message: "Message sent",
                data: {
                    id: message.id,
                    conversationId: message.conversationId,
                    senderId: message.senderId,
                    content: message.content,
                    createdAt: message.createdAt,
                    senderType,
                    sender: {
                        id: message.sender.id,
                        name: message.sender.name,
                        isAdmin: senderType === "admin",
                    },
                },
            });
        }
        catch (err) {
            return res.status(400).json({ error: err.message });
        }
    },
    getMessages: async (req, res) => {
        try {
            const { conversationId } = req.params;
            const messages = await chat_service_1.chatService.getMessages(conversationId);
            return res.json({
                message: "Messages retrieved",
                messages,
            });
        }
        catch (err) {
            return res.status(400).json({ error: err.message });
        }
    },
    closeConversation: async (req, res) => {
        try {
            const { conversationId } = req.body;
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            const conversation = await chat_service_1.chatService.closeConversation(conversationId);
            return res.json({
                message: "Conversation closed",
                conversation,
            });
        }
        catch (err) {
            return res.status(400).json({ error: err.message });
        }
    },
    deleteConversation: async (req, res) => {
        try {
            const { conversationId } = req.params;
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            await chat_service_1.chatService.deleteConversation(conversationId);
            return res.status(204).send();
        }
        catch (err) {
            return res.status(400).json({ error: err.message });
        }
    },
};
