import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const userController = {
  getActiveUserCount: async (req: Request, res: Response) => {
    try {
      const count = await prisma.user.count({ where: { active: true } });
      return res.json({ activeUserCount: count });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  },

  getActiveUsers: async (_req: Request, res: Response) => {
    try {
      const users = await prisma.user.findMany({
        where: { active: true },
        select: {
          id: true,
          name: true,
          studentId: true,
          active: true,
          isAdmin: true,
        },
      });
      return res.json({ users });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  },

  getAllUsers: async (_req: Request, res: Response) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          studentId: true,
          active: true,
          isAdmin: true,
        },
      });
      return res.json({ users });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  },
};

