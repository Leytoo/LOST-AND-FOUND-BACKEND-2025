import express from "express";
import { lostItemController } from "../controllers/lostItem.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";
import multer from "multer";

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

// Public routes
router.get("/", lostItemController.getLostItems);
router.get("/:id", lostItemController.getLostItemById);

// User route to report lost item (with image upload)
router.post(
  "/",
  upload.single("image"),
  authMiddleware,
  lostItemController.createLostItem
);

// User can update their own items
router.patch("/:id", authMiddleware, lostItemController.updateLostItem);

// Admin only - delete lost items
router.delete("/:id",authMiddleware,adminMiddleware,lostItemController.deleteLostItem);
router.patch("/:id/mark-as-found",authMiddleware,adminMiddleware,lostItemController.markAsFound
);

export default router;
