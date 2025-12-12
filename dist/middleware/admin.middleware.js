"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = void 0;
const client_1 = require("../prisma/client");
const adminMiddleware = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const user = await client_1.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user || !user.isAdmin) {
            return res.status(403).json({ error: "Access denied. Admin privileges required." });
        }
        req.user = { id: userId, isAdmin: true };
        next();
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.adminMiddleware = adminMiddleware;
