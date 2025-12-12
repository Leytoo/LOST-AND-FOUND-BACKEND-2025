"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.foundItemController = void 0;
const foundItem_service_1 = require("../service/foundItem.service");
exports.foundItemController = {
    createFoundItem: async (req, res) => {
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
            if (!userId)
                return res.status(401).json({ error: "Unauthorized" });
            const item = await foundItem_service_1.foundItemService.createFoundItem(cleanTitle, cleanDescription, cleanCategory, cleanLocation, userId, image);
            return res.status(201).json({
                message: "Found item posted successfully",
                item,
            });
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },
    getFoundItems: async (req, res) => {
        try {
            const { category } = req.query;
            const items = await foundItem_service_1.foundItemService.getFoundItems({
                category: category,
            });
            return res.json({
                message: "Found items retrieved",
                items,
            });
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },
    getFoundItemById: async (req, res) => {
        try {
            const { id } = req.params;
            const item = await foundItem_service_1.foundItemService.getFoundItemById(id);
            return res.json({
                message: "Found item retrieved",
                item,
            });
        }
        catch (error) {
            return res.status(404).json({ error: error.message });
        }
    },
    updateFoundItem: async (req, res) => {
        try {
            const { id } = req.params;
            const { title, description } = req.body;
            const userId = req.user?.id;
            if (!userId)
                return res.status(401).json({ error: "Unauthorized" });
            const item = await foundItem_service_1.foundItemService.getFoundItemById(id);
            if (item.postedBy !== userId) {
                return res.status(403).json({ error: "You can only update your own items" });
            }
            const updatedItem = await foundItem_service_1.foundItemService.updateFoundItem(id, { title, description });
            return res.json({
                message: "Found item updated",
                item: updatedItem,
            });
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },
    deleteFoundItem: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user?.id;
            if (!userId)
                return res.status(401).json({ error: "Unauthorized" });
            const item = await foundItem_service_1.foundItemService.getFoundItemById(id);
            if (item.postedBy !== userId) {
                return res.status(403).json({ error: "You can only delete your own items" });
            }
            await foundItem_service_1.foundItemService.deleteFoundItem(id);
            return res.json({ message: "Found item deleted" });
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },
};
