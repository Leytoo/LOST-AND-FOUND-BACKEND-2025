import { foundItemRepository } from "../repository/foundItem.repository";

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

  async updateFoundItem(id: string, updates: Partial<{ title: string; description: string }>) {
    return await foundItemRepository.update(id, updates);
  },

  async deleteFoundItem(id: string) {
    return await foundItemRepository.delete(id);
  },
};
