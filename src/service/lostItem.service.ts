import { lostItemRepository } from "../repository/lostItem.repository";

type LostItemUpdates = Partial<{ title: string; description: string; status: string; isFound: boolean }>;

export const lostItemService = {
  async createLostItem(
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

    return await lostItemRepository.create({
      title,
      description,
      category,
      location,
      image,
      postedBy,
    });
  },

  async getLostItems(filters?: { status?: string; category?: string }) {
    return await lostItemRepository.findAll(filters);
  },

  async getLostItemById(id: string) {
    const item = await lostItemRepository.findById(id);
    if (!item) throw new Error("Lost item not found");
    return item;
  },

  async updateLostItem(id: string, updates: LostItemUpdates) {
    return await lostItemRepository.update(id, updates);
  },

  async markLostItemAsFound(id: string) {
  const item = await lostItemRepository.findById(id);
  if (!item) {
    throw new Error("Lost item not found");
  }

  if (item.isFound) {
    return item;
  }

  return await lostItemRepository.update(id, { 
    isFound: true,      // ← ADD THIS
    status: "found" 
  });
},

  async deleteLostItem(id: string) {
    return await lostItemRepository.delete(id);
  },
};
