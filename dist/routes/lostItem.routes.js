"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const lostItem_controller_1 = require("../controllers/lostItem.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const admin_middleware_1 = require("../middleware/admin.middleware");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = (0, multer_1.default)({ storage });
// Public routes
router.get("/", lostItem_controller_1.lostItemController.getLostItems);
router.get("/:id", lostItem_controller_1.lostItemController.getLostItemById);
// User route to report lost item (with image upload)
router.post("/", upload.single("image"), auth_middleware_1.authMiddleware, lostItem_controller_1.lostItemController.createLostItem);
// User can update their own items
router.patch("/:id", auth_middleware_1.authMiddleware, lostItem_controller_1.lostItemController.updateLostItem);
// Admin only - delete lost items
router.delete("/:id", auth_middleware_1.authMiddleware, admin_middleware_1.adminMiddleware, lostItem_controller_1.lostItemController.deleteLostItem);
router.patch("/:id/mark-as-found", auth_middleware_1.authMiddleware, admin_middleware_1.adminMiddleware, lostItem_controller_1.lostItemController.markAsFound);
exports.default = router;
