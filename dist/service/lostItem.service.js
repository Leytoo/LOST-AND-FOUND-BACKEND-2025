"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lostItemService = void 0;
const lostItem_repository_1 = require("../repository/lostItem.repository");
exports.lostItemService = {
    async createLostItem(title, description, category, location, postedBy, image) {
        if (!title || !description || !category || !location) {
            throw new Error("Title, description, category, and location are required");
        }
        return await lostItem_repository_1.lostItemRepository.create({
            title,
            description,
            category,
            location,
            image,
            postedBy,
        });
    },
    async getLostItems(filters) {
        return await lostItem_repository_1.lostItemRepository.findAll(filters);
    },
    async getLostItemById(id) {
        const item = await lostItem_repository_1.lostItemRepository.findById(id);
        if (!item)
            throw new Error("Lost item not found");
        return item;
    },
    async updateLostItem(id, updates) {
        return await lostItem_repository_1.lostItemRepository.update(id, updates);
    },
    async markLostItemAsFound(id) {
        const item = await lostItem_repository_1.lostItemRepository.findById(id);
        if (!item) {
            throw new Error("Lost item not found");
        }
        if (item.isFound) {
            return item;
        }
        return await lostItem_repository_1.lostItemRepository.update(id, {
            isFound: true, // ← ADD THIS
            status: "found"
        });
    },
    async deleteLostItem(id) {
        return await lostItem_repository_1.lostItemRepository.delete(id);
    },
};
