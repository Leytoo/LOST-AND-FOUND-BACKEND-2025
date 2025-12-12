"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.post("/signup", auth_controller_1.authController.signup);
router.post("/login", auth_controller_1.authController.login);
router.post("/change-password", auth_controller_1.authController.changePassword);
router.post("/change-studentid", auth_controller_1.authController.changeStudentId);
// Protected route example
router.get("/profile", auth_middleware_1.authMiddleware, (req, res) => {
    res.json({ message: "This is a protected route", user: req.user });
});
exports.default = router;
