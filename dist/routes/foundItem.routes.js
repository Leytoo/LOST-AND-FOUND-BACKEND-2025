"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const foundItem_controller_1 = require("../controllers/foundItem.controller");
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
router.get("/", foundItem_controller_1.foundItemController.getFoundItems);
router.get("/:id", foundItem_controller_1.foundItemController.getFoundItemById);
// Admin only routes (post, update, delete found items)
router.post("/", upload.single("image"), auth_middleware_1.authMiddleware, admin_middleware_1.adminMiddleware, foundItem_controller_1.foundItemController.createFoundItem);
router.patch("/:id", auth_middleware_1.authMiddleware, admin_middleware_1.adminMiddleware, foundItem_controller_1.foundItemController.updateFoundItem);
router.delete("/:id", auth_middleware_1.authMiddleware, admin_middleware_1.adminMiddleware, foundItem_controller_1.foundItemController.deleteFoundItem);
exports.default = router;
