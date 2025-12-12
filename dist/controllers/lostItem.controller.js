"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lostItemController = void 0;
const lostItem_service_1 = require("../service/lostItem.service");
exports.lostItemController = {
    createLostItem: async (req, res) => {
        try {
            const { title, description, category, location } = req.body;
            const userId = req.user?.id;
            const image = req.file ? `/uploads/${req.file.filename}` : undefined; // Pass `image` to your service/database
            if (!userId)
                return res.status(401).json({ error: "Unauthorized" });
            const item = await lostItem_service_1.lostItemService.createLostItem(title, description, category, location, userId, image);
            return res.status(201).json({
                message: "Lost item posted successfully",
                item,
            });
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },
    getLostItems: async (req, res) => {
        try {
            const { status, category } = req.query;
            const items = await lostItem_service_1.lostItemService.getLostItems({
                status: status,
                category: category,
            });
            return res.json({
                message: "Lost items retrieved",
                items,
            });
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },
    getLostItemById: async (req, res) => {
        try {
            const { id } = req.params;
            const item = await lostItem_service_1.lostItemService.getLostItemById(id);
            return res.json({
                message: "Lost item retrieved",
                item,
            });
        }
        catch (error) {
            return res.status(404).json({ error: error.message });
        }
    },
    updateLostItem: async (req, res) => {
        try {
            const { id } = req.params;
            const { title, description, status } = req.body;
            const userId = req.user?.id;
            if (!userId)
                return res.status(401).json({ error: "Unauthorized" });
            const item = await lostItem_service_1.lostItemService.getLostItemById(id);
            if (item.postedBy !== userId) {
                return res.status(403).json({ error: "You can only update your own items" });
            }
            const updatedItem = await lostItem_service_1.lostItemService.updateLostItem(id, { title, description, status });
            return res.json({
                message: "Lost item updated",
                item: updatedItem,
            });
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },
    markAsFound: async (req, res) => {
        try {
            const { id } = req.params;
            const updatedItem = await lostItem_service_1.lostItemService.markLostItemAsFound(id);
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
            }
            catch (pusherError) {
                console.warn(`⚠️ Failed to trigger Pusher event:`, pusherError);
                // Don't fail the response if Pusher fails
            }
            return res.json({
                message: "Lost item marked as found",
                item: updatedItem,
            });
        }
        catch (error) {
            const statusCode = error.message === "Lost item not found" ? 404 : 400;
            return res.status(statusCode).json({ error: error.message });
        }
    },
    deleteLostItem: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user?.id;
            const isAdmin = Boolean(req.user?.isAdmin);
            if (!userId)
                return res.status(401).json({ error: "Unauthorized" });
            const item = await lostItem_service_1.lostItemService.getLostItemById(id);
            if (!isAdmin && item.postedBy !== userId) {
                return res.status(403).json({ error: "You can only delete your own items" });
            }
            await lostItem_service_1.lostItemService.deleteLostItem(id);
            return res.json({ message: "Lost item deleted" });
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },
};
