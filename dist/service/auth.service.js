"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const auth_repository_1 = require("../repository/auth.repository");
const generateToken_1 = require("../utils/generateToken");
const validation_1 = require("../utils/validation");
const sanitizeUser_1 = require("../utils/sanitizeUser");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.authService = {
    async signup(name, studentId, password) {
        (0, validation_1.validateSignupInput)(name, studentId, password);
        const existing = await auth_repository_1.authRepository.findByStudentId(studentId);
        if (existing)
            throw new Error("Student already exists");
        const hash = await bcryptjs_1.default.hash(password, 10);
        const user = await auth_repository_1.authRepository.createUser(studentId, name, hash);
        return { user: (0, sanitizeUser_1.sanitizeUser)(user) };
    },
    async login(studentId, password, type) {
        (0, validation_1.validateLoginInput)(studentId, password);
        const user = await auth_repository_1.authRepository.findByStudentId(studentId);
        if (!user)
            throw new Error("Invalid credentials");
        const match = await bcryptjs_1.default.compare(password, user.password);
        if (!match)
            throw new Error("Invalid credentials");
        // Role validation: check if login type matches user's admin status
        if (type === "user" && user.isAdmin) {
            throw new Error("Admin accounts must use admin portal");
        }
        if (type === "admin" && !user.isAdmin) {
            throw new Error("Only admin accounts can access admin portal");
        }
        const token = (0, generateToken_1.generateToken)(user.id);
        return { user: (0, sanitizeUser_1.sanitizeUser)(user), token, isAdmin: user.isAdmin, type: user.isAdmin ? "admin" : "user" };
    },
    async changePassword(studentId, oldPassword, newPassword) {
        const user = await auth_repository_1.authRepository.findByStudentId(studentId);
        if (!user)
            throw new Error("User not found");
        const match = await bcryptjs_1.default.compare(oldPassword, user.password);
        if (!match)
            throw new Error("Old password is incorrect");
        if (oldPassword === newPassword)
            throw new Error("New password must be different");
        // Validate new password
        const { valid, message } = require("../utils/validation").validatePassword(newPassword);
        if (!valid)
            throw new Error(message);
        const newHash = await bcryptjs_1.default.hash(newPassword, 10);
        await prisma.user.update({
            where: { studentId },
            data: { password: newHash }
        });
        return true;
    },
    async changeStudentId(oldStudentId, newStudentId, password) {
        // Validate new studentId
        const { validateStudentId } = require("../utils/validation");
        if (!validateStudentId(newStudentId))
            throw new Error("New student ID must be an 8-digit number");
        const user = await auth_repository_1.authRepository.findByStudentId(oldStudentId);
        if (!user)
            throw new Error("User not found");
        const match = await bcryptjs_1.default.compare(password, user.password);
        if (!match)
            throw new Error("Password is incorrect");
        // Check if new studentId already exists
        const existing = await auth_repository_1.authRepository.findByStudentId(newStudentId);
        if (existing)
            throw new Error("New student ID already exists");
        await prisma.user.update({
            where: { studentId: oldStudentId },
            data: { studentId: newStudentId }
        });
        return true;
    }
};
