"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.foundItemService = void 0;
const foundItem_repository_1 = require("../repository/foundItem.repository");
exports.foundItemService = {
    async createFoundItem(title, description, category, location, postedBy, image) {
        if (!title || !description || !category || !location) {
            throw new Error("Title, description, category, and location are required");
        }
        return await foundItem_repository_1.foundItemRepository.create({
            title,
            description,
            category,
            location,
            image,
            postedBy,
        });
    },
    async getFoundItems(filters) {
        return await foundItem_repository_1.foundItemRepository.findAll(filters);
    },
    async getFoundItemById(id) {
        const item = await foundItem_repository_1.foundItemRepository.findById(id);
        if (!item)
            throw new Error("Found item not found");
        return item;
    },
    async updateFoundItem(id, updates) {
        return await foundItem_repository_1.foundItemRepository.update(id, updates);
    },
    async deleteFoundItem(id) {
        return await foundItem_repository_1.foundItemRepository.delete(id);
    },
};
