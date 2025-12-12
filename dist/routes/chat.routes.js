"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chat_controller_1 = require("../controllers/chat.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const admin_middleware_1 = require("../middleware/admin.middleware");
const router = express_1.default.Router();
// User routes (message admin about found items)
router.post("/conversation", auth_middleware_1.authMiddleware, chat_controller_1.chatController.startConversation);
router.get("/conversation/:conversationId", auth_middleware_1.authMiddleware, chat_controller_1.chatController.getConversation); // ← Changed from foundItemId
router.get("/user-conversations", auth_middleware_1.authMiddleware, chat_controller_1.chatController.getUserConversations);
// Admin routes
router.get("/admin/conversations", auth_middleware_1.authMiddleware, chat_controller_1.chatController.getAdminConversations);
router.patch("/conversation/close", auth_middleware_1.authMiddleware, chat_controller_1.chatController.closeConversation);
router.delete("/conversation/:conversationId", auth_middleware_1.authMiddleware, admin_middleware_1.adminMiddleware, chat_controller_1.chatController.deleteConversation);
// Messages
router.post("/message", auth_middleware_1.authMiddleware, chat_controller_1.chatController.sendMessage);
router.get("/messages/:conversationId", chat_controller_1.chatController.getMessages);
exports.default = router;
