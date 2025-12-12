import { foundItemRepository } from "../repository/foundItem.repository";
import { pusher } from "../config/pusher.config";

type UpdateFoundItemInput = Partial<{
  title: string;
  description: string;
  category: string;
  location: string;
  image: string;
  isFound: boolean;
  status: string;
  claimedAt: Date | null;
}>;

export const foundItemService = {
  async createFoundItem(
    title: string,
    description: string,
    category: string,
    location: string,
    postedBy: string,
    image?: string
  ) {
    if (!title || !description || !category || !location) {
      throw new Error("Title, description, category, and location are required");
    }

    return await foundItemRepository.create({
      title,
      description,
      category,
      location,
      image,
      postedBy,
    });
  },

  async getFoundItems(filters?: { category?: string }) {
    return await foundItemRepository.findAll(filters);
  },

  async getFoundItemById(id: string) {
    const item = await foundItemRepository.findById(id);
    if (!item) throw new Error("Found item not found");
    return item;
  },

  async updateFoundItem(id: string, updates: UpdateFoundItemInput) {
    return await foundItemRepository.update(id, updates);
  },

  async deleteFoundItem(id: string) {
    return await foundItemRepository.delete(id);
  },

  async markAsClaimed(id: string, adminId: string | undefined) {
    if (!adminId) {
      const error: any = new Error("Unauthorized");
      error.status = 401;
      throw error;
    }

    const item = await foundItemRepository.findById(id);
    if (!item) {
      const error: any = new Error("Found item not found");
      error.status = 404;
      throw error;
    }

    if (item.isFound) {
      return item; // already claimed; no-op
    }

    const updated = await foundItemRepository.update(id, {
      isFound: true,
      status: "claimed",
      claimedAt: new Date(),
    });

    try {
      await pusher.trigger("found-items-updates", "item-claimed", {
        itemId: updated.id,
        isFound: true,
        status: updated.status,
        timestamp: new Date().toISOString(),
      });
    } catch (pushError) {
      console.warn("Pusher event failed for markAsClaimed:", pushError);
    }

    return updated;
  },
};