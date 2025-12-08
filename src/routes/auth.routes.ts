import express from "express";
import { authController } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

// Protected route example
router.get("/profile", authMiddleware, (req, res) => {
  res.json({ message: "This is a protected route", user: (req as any).user });
});

export default router;
