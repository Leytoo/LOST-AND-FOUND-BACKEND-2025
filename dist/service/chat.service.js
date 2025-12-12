"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatService = void 0;
const conversation_repository_1 = require("../repository/conversation.repository");
const message_repository_1 = require("../repository/message.repository");
exports.chatService = {
    async startConversation(userId, foundItemId, subject) {
        let conversation = await conversation_repository_1.conversationRepository.findByUserAndItem(userId, foundItemId);
        if (!conversation) {
            conversation = await conversation_repository_1.conversationRepository.create({ userId, foundItemId, subject });
        }
        return conversation;
    },
    async getConversation(conversationId) {
        const conversation = await conversation_repository_1.conversationRepository.findById(conversationId); // ← Use findById
        if (!conversation)
            throw new Error("Conversation not found");
        return conversation;
    },
    async getUserConversations(userId) {
        return await conversation_repository_1.conversationRepository.findByUserId(userId);
    },
    async getAdminConversations() {
        return await conversation_repository_1.conversationRepository.findAll();
    },
    async sendMessage(conversationId, senderId, content) {
        if (!content || content.trim().length === 0) {
            throw new Error("Message cannot be empty");
        }
        const conversation = await conversation_repository_1.conversationRepository.findById(conversationId);
        if (!conversation)
            throw new Error("Conversation not found");
        return await message_repository_1.messageRepository.create({
            conversationId,
            senderId,
            content: content.trim(),
        });
    },
    async getMessages(conversationId) {
        return await message_repository_1.messageRepository.findByConversationId(conversationId);
    },
    async closeConversation(conversationId) {
        return await conversation_repository_1.conversationRepository.updateStatus(conversationId, "resolved");
    },
    async deleteConversation(conversationId) {
        await message_repository_1.messageRepository.deleteByConversationId(conversationId);
        await conversation_repository_1.conversationRepository.delete(conversationId);
    },
};
