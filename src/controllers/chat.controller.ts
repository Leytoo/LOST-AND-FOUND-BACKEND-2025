  import { Request, Response } from "express";
  import { chatService } from "../service/chat.service";
  import { AuthRequest } from "../middleware/auth.middleware";
  import { pusher } from "../config/pusher.config";
  import { prisma } from "../prisma/client";

  export const chatController = {
    startConversation: async (req: AuthRequest, res: Response) => {
      try {
        const { foundItemId, subject } = req.body;
        const userId = req.user?.id;

        if (!userId) {
          return res.status(401).json({ error: "Unauthorized" });
        }

        if (!foundItemId || !subject) {
          return res.status(400).json({ error: "Found item ID and subject are required" });
        }

        const conversation = await chatService.startConversation(userId, foundItemId, subject);

        return res.status(201).json({
          message: "Conversation started",
          conversation,
        });
      } catch (err: any) {
        return res.status(400).json({ error: err.message });
      }
    },

    getConversation: async (req: AuthRequest, res: Response) => {
      try {
        const { conversationId } = req.params;
        const userId = req.user?.id;

        if (!userId) {
          return res.status(401).json({ error: "Unauthorized" });
        }

        const conversation = await chatService.getConversation(conversationId);

        return res.json({
          message: "Conversation retrieved",
          conversation,
        });
      } catch (err: any) {
        return res.status(404).json({ error: err.message });
      }
    },
    
    getUserConversations: async (req: AuthRequest, res: Response) => {
      try {
        const userId = req.user?.id;

        if (!userId) {
          return res.status(401).json({ error: "Unauthorized" });
        }

        const conversations = await chatService.getUserConversations(userId);

        return res.json({
          message: "User conversations retrieved",
          conversations,
        });
      } catch (err: any) {
        return res.status(400).json({ error: err.message });
      }
    },

    getAdminConversations: async (req: AuthRequest, res: Response) => {
      try {
        const userId = req.user?.id;

        if (!userId) {
          return res.status(401).json({ error: "Unauthorized" });
        }

        const conversations = await chatService.getAdminConversations();

        return res.json({
          message: "All conversations retrieved",
          conversations,
        });
      } catch (err: any) {
        return res.status(400).json({ error: err.message });
      }
    },

    sendMessage: async (req: AuthRequest, res: Response) => {
      try {
        const { conversationId, content } = req.body;
        const userId = req.user?.id;

        if (!userId) {
          return res.status(401).json({ error: "Unauthorized" });
        }

        if (!conversationId || !content) {
          return res.status(400).json({ error: "Conversation ID and content are required" });
        }

        const conversation = await chatService.getConversation(conversationId);

        const message = await prisma.message.create({
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

        await pusher.trigger(`conversation-${conversationId}`, "message-sent", {
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
      } catch (err: any) {
        return res.status(400).json({ error: err.message });
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
      } catch (err: any) {
        return res.status(400).json({ error: err.message });
      }
    },
    
    closeConversation: async (req: AuthRequest, res: Response) => {
      try {
        const { conversationId } = req.body;
        const userId = req.user?.id;

        if (!userId) {
          return res.status(401).json({ error: "Unauthorized" });
        }

        const conversation = await chatService.closeConversation(conversationId);

        return res.json({
          message: "Conversation closed",
          conversation,
        });
      } catch (err: any) {
        return res.status(400).json({ error: err.message });
      }
    },

deleteConversation: async (req: AuthRequest, res: Response) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    await chatService.deleteConversation(conversationId);

    return res.status(204).send();
  } catch (err: any) {
    if (err.status === 404) {
      return res.status(404).json({ error: err.message });
    }
    return res.status(400).json({ error: err.message });
  }
},  };
