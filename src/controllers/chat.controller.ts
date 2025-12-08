import { Request, Response } from "express";
import { chatService } from "../service/chat.service";
import { AuthRequest } from "../middleware/auth.middleware";
import { pusher } from "../config/pusher.config";

export const chatController = {
  startConversation: async (req: AuthRequest, res: Response) => {
    try {
      const { foundItemId, subject } = req.body;
      const userId = req.user?.id;

      if (!userId) return res.status(401).json({ error: "Unauthorized" });
      if (!foundItemId || !subject) {
        return res.status(400).json({ error: "Found item ID and subject are required" });
      }

      const conversation = await chatService.startConversation(userId, foundItemId, subject);

      return res.status(201).json({
        message: "Conversation started",
        conversation,
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  },

  getConversation: async (req: AuthRequest, res: Response) => {
    try {
      const { foundItemId } = req.params;
      const userId = req.user?.id;

      if (!userId) return res.status(401).json({ error: "Unauthorized" });

      const conversation = await chatService.getConversation(userId, foundItemId);

      return res.json({
        message: "Conversation retrieved",
        conversation,
      });
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  },

  getUserConversations: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;

      if (!userId) return res.status(401).json({ error: "Unauthorized" });

      const conversations = await chatService.getUserConversations(userId);

      return res.json({
        message: "User conversations retrieved",
        conversations,
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  },

  getAdminConversations: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;

      if (!userId) return res.status(401).json({ error: "Unauthorized" });
      // TODO: Add admin role check here

      const conversations = await chatService.getAdminConversations();

      return res.json({
        message: "All conversations retrieved",
        conversations,
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  },

  sendMessage: async (req: AuthRequest, res: Response) => {
    try {
      const { conversationId, content } = req.body;
      const userId = req.user?.id;

      if (!userId) return res.status(401).json({ error: "Unauthorized" });

      // Save message to database
      const message = await chatService.sendMessage(conversationId, userId, content);

      // Trigger Pusher event for real-time update
      await pusher.trigger(
        `conversation-${conversationId}`,
        "message-sent",
        {
          id: message.id,
          conversationId: message.conversationId,
          senderId: message.senderId,
          content: message.content,
          createdAt: message.createdAt,
          sender: {
            id: message.sender.id,
            name: message.sender.name,
          },
        }
      );

      res.status(201).json({
        message: "Message sent",
        data: message,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  getMessages: async (req: Request, res: Response) => {
    try {
      const { conversationId } = req.params;

      const messages = await chatService.getMessages(conversationId);

      return res.json({
        message: "Messages retrieved",
        messages,
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  },

  closeConversation: async (req: AuthRequest, res: Response) => {
    try {
      const { conversationId } = req.body;
      const userId = req.user?.id;

      if (!userId) return res.status(401).json({ error: "Unauthorized" });
      // TODO: Add admin role check here

      const conversation = await chatService.closeConversation(conversationId);

      return res.json({
        message: "Conversation closed",
        conversation,
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  },
};
