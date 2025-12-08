import express from "express";
import { chatController } from "../controllers/chat.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

// User routes (message admin about found items)
router.post("/conversation", authMiddleware, chatController.startConversation);
router.get("/conversation/:foundItemId", authMiddleware, chatController.getConversation);
router.get("/user-conversations", authMiddleware, chatController.getUserConversations);

// Admin routes
router.get("/admin/conversations", authMiddleware, chatController.getAdminConversations);
router.patch("/conversation/close", authMiddleware, chatController.closeConversation);

// Messages
router.post("/message", authMiddleware, chatController.sendMessage);
router.get("/messages/:conversationId", chatController.getMessages);

export default router;
