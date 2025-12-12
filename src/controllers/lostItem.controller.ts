import { Request, Response } from "express";
import { lostItemService } from "../service/lostItem.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const lostItemController = {
  createLostItem: async (req: AuthRequest, res: Response) => {
    try {
      const { title, description, category, location } = req.body;
      const userId = req.user?.id;
      const image = req.file ? `/uploads/${req.file.filename}` : undefined; // Pass `image` to your service/database

      if (!userId) return res.status(401).json({ error: "Unauthorized" });

      const item = await lostItemService.createLostItem(title, description, category, location, userId, image);

      return res.status(201).json({
        message: "Lost item posted successfully",
        item,
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  },

  getLostItems: async (req: Request, res: Response) => {
    try {
      const { status, category } = req.query;
      const items = await lostItemService.getLostItems({
        status: status as string,
        category: category as string,
      });

      return res.json({
        message: "Lost items retrieved",
        items,
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  },

  getLostItemById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const item = await lostItemService.getLostItemById(id);

      return res.json({
        message: "Lost item retrieved",
        item,
      });
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  },

  updateLostItem: async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { title, description, status } = req.body;
      const userId = req.user?.id;

      if (!userId) return res.status(401).json({ error: "Unauthorized" });

      const item = await lostItemService.getLostItemById(id);
      if (item.postedBy !== userId) {
        return res.status(403).json({ error: "You can only update your own items" });
      }

      const updatedItem = await lostItemService.updateLostItem(id, { title, description, status });

      return res.json({
        message: "Lost item updated",
        item: updatedItem,
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  },

  markAsFound: async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updatedItem = await lostItemService.markLostItemAsFound(id);

    // 📡 Trigger Pusher event to notify users in real-time
    try {
      const Pusher = require("pusher");
      const pusher = new Pusher({
        appId: process.env.PUSHER_APP_ID,
        key: process.env.PUSHER_KEY,
        secret: process.env.PUSHER_SECRET,
        cluster: process.env.PUSHER_CLUSTER,
      });

      await pusher.trigger('lost-items-updates', 'item-marked-found', {
        itemId: id,
        isFound: true,
        timestamp: new Date().toISOString()
      });

      console.log(`✅ Pusher event triggered for item ${id}`);
    } catch (pusherError) {
      console.warn(`⚠️ Failed to trigger Pusher event:`, pusherError);
      // Don't fail the response if Pusher fails
    }

    return res.json({
      message: "Lost item marked as found",
      item: updatedItem,
    });
  } catch (error: any) {
    const statusCode = error.message === "Lost item not found" ? 404 : 400;
    return res.status(statusCode).json({ error: error.message });
  }
},

  deleteLostItem: async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const isAdmin = Boolean(req.user?.isAdmin);

      if (!userId) return res.status(401).json({ error: "Unauthorized" });

      const item = await lostItemService.getLostItemById(id);
      if (!isAdmin && item.postedBy !== userId) {
        return res.status(403).json({ error: "You can only delete your own items" });
      }

      await lostItemService.deleteLostItem(id);

      return res.json({ message: "Lost item deleted" });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  },
};
