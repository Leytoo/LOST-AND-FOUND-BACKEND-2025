import express from "express";
import { foundItemController } from "../controllers/foundItem.controller";
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
router.get("/", foundItemController.getFoundItems);
router.get("/:id", foundItemController.getFoundItemById);

// Admin only routes (post, update, delete found items)
router.post(
  "/",
  upload.single("image"),
  authMiddleware,
  adminMiddleware,
  foundItemController.createFoundItem
);
router.patch("/:id", authMiddleware, adminMiddleware, foundItemController.updateFoundItem);
router.delete("/:id", authMiddleware, adminMiddleware, foundItemController.deleteFoundItem);
router.patch("/:id/mark-as-claimed", authMiddleware, adminMiddleware,foundItemController.markAsClaimed);

export default router;
