import express from "express";
import { chatController } from "../controllers/chat.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";

const router = express.Router();

// User routes (message admin about found items)
router.post("/conversation", authMiddleware, chatController.startConversation);
router.get("/conversation/:conversationId", authMiddleware, chatController.getConversation); // ← Changed from foundItemId
router.get("/user-conversations", authMiddleware, chatController.getUserConversations);

// Admin routes
router.get("/admin/conversations", authMiddleware, chatController.getAdminConversations);
router.patch("/conversation/close", authMiddleware, chatController.closeConversation);
router.delete("/conversation/:conversationId", authMiddleware, adminMiddleware, chatController.deleteConversation);

// Messages
router.post("/message", authMiddleware, chatController.sendMessage);
router.get("/messages/:conversationId", chatController.getMessages);

export default router;