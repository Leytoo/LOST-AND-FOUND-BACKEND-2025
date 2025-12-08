import express from "express";
import { lostItemController } from "../controllers/lostItem.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

// Public routes
router.get("/", lostItemController.getLostItems);
router.get("/:id", lostItemController.getLostItemById);

// Protected routes
router.post("/", authMiddleware, lostItemController.createLostItem);
router.patch("/:id", authMiddleware, lostItemController.updateLostItem);
router.delete("/:id", authMiddleware, lostItemController.deleteLostItem);

export default router;
