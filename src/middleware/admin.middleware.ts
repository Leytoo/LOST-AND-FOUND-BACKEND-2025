import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
import { prisma } from "../prisma/client";

export const adminMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: "Access denied. Admin privileges required." });
    }

    req.user = { id: userId, isAdmin: true };

    next();
  } catch (error: any) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
