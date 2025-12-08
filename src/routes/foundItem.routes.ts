import express from "express";
import { foundItemController } from "../controllers/foundItem.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";

const router = express.Router();

// Public routes
router.get("/", foundItemController.getFoundItems);
router.get("/:id", foundItemController.getFoundItemById);

// Admin only routes (post, update, delete found items)
router.post("/", authMiddleware, adminMiddleware, foundItemController.createFoundItem);
router.patch("/:id", authMiddleware, adminMiddleware, foundItemController.updateFoundItem);
router.delete("/:id", authMiddleware, adminMiddleware, foundItemController.deleteFoundItem);

export default router;
