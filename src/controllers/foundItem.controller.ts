import { Request, Response } from "express";
import { foundItemService } from "../service/foundItem.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const foundItemController = {
  createFoundItem: async (req: AuthRequest, res: Response) => {
    try {
      const { title, description, category, location } = req.body;
      const userId = req.user?.id;
      const image = req.file ? `/uploads/${req.file.filename}` : undefined;

      // Trim whitespace/tabs from fields
      const cleanTitle = title?.trim();
      const cleanDescription = description?.trim();
      const cleanCategory = category?.trim();
      const cleanLocation = location?.trim();

      console.log("Request body:", req.body);
      console.log("Request file:", req.file);
      console.log("User ID:", userId);

      if (!userId) return res.status(401).json({ error: "Unauthorized" });

      const item = await foundItemService.createFoundItem(
        cleanTitle,
        cleanDescription,
        cleanCategory,
        cleanLocation,
        userId,
        image
      );

      return res.status(201).json({
        message: "Found item posted successfully",
        item,
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  },

  getFoundItems: async (req: Request, res: Response) => {
    try {
      const { category } = req.query;
      const items = await foundItemService.getFoundItems({
        category: category as string,
      });

      return res.json({
        message: "Found items retrieved",
        items,
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  },

  getFoundItemById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const item = await foundItemService.getFoundItemById(id);

      return res.json({
        message: "Found item retrieved",
        item,
      });
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  },

  updateFoundItem: async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { title, description } = req.body;
      const userId = req.user?.id;

      if (!userId) return res.status(401).json({ error: "Unauthorized" });

      const item = await foundItemService.getFoundItemById(id);
      if (item.postedBy !== userId) {
        return res.status(403).json({ error: "You can only update your own items" });
      }

      const updatedItem = await foundItemService.updateFoundItem(id, { title, description });

      return res.json({
        message: "Found item updated",
        item: updatedItem,
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  },
  markAsClaimed: async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const adminId = req.user?.id;

    if (!adminId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const item = await foundItemService.markAsClaimed(id, adminId);

    return res.json({
      message: "Found item marked as claimed",
      item,
    });
  } catch (error: any) {
    const status = error.status ?? (error.message === "Found item not found" ? 404 : 400);
    return res.status(status).json({ error: error.message });
  }
},
  deleteFoundItem: async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) return res.status(401).json({ error: "Unauthorized" });

      const item = await foundItemService.getFoundItemById(id);
      if (item.postedBy !== userId) {
        return res.status(403).json({ error: "You can only delete your own items" });
      }

      await foundItemService.deleteFoundItem(id);

      return res.json({ message: "Found item deleted" });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  },
};
