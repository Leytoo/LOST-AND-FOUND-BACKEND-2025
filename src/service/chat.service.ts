import { conversationRepository } from "../repository/conversation.repository";
import { messageRepository } from "../repository/message.repository";

export const chatService = {
  async startConversation(userId: string, foundItemId: string, subject: string) {
    let conversation = await conversationRepository.findByUserAndItem(userId, foundItemId);
    if (!conversation) {
      conversation = await conversationRepository.create({ userId, foundItemId, subject });
    }
    return conversation;
  },

  async getConversation(conversationId: string) { // ← Changed parameter
  const conversation = await conversationRepository.findById(conversationId); // ← Use findById
  if (!conversation) throw new Error("Conversation not found");
  return conversation;
},

  async getUserConversations(userId: string) {
    return await conversationRepository.findByUserId(userId);
  },

  async getAdminConversations() {
    return await conversationRepository.findAll();
  },

  async sendMessage(conversationId: string, senderId: string, content: string) {
    if (!content || content.trim().length === 0) {
      throw new Error("Message cannot be empty");
    }

    const conversation = await conversationRepository.findById(conversationId);
    if (!conversation) throw new Error("Conversation not found");

    return await messageRepository.create({
      conversationId,
      senderId,
      content: content.trim(),
    });
  },

  async getMessages(conversationId: string) {
    return await messageRepository.findByConversationId(conversationId);
  },

  async closeConversation(conversationId: string) {
    return await conversationRepository.updateStatus(conversationId, "resolved");
  },

async deleteConversation(conversationId: string) {
  const conversation = await conversationRepository.findById(conversationId);
  if (!conversation) {
    const error: any = new Error("Conversation not found");
    error.status = 404;
    throw error;
  }
  await messageRepository.deleteByConversationId(conversationId);
  await conversationRepository.delete(conversationId);
}
};
