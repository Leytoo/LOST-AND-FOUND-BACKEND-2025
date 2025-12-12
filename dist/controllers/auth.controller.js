"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_service_1 = require("../service/auth.service");
exports.authController = {
    signup: async (req, res) => {
        try {
            const { name, studentId, password } = req.body;
            const result = await auth_service_1.authService.signup(name, studentId, password);
            return res.status(201).json({
                message: "Student registered successfully. Please login to continue.",
                user: result.user
            });
        }
        catch (error) {
            const status = error.message.includes("required") || error.message.includes("format") || error.message.includes("must") ? 422 : 400;
            return res.status(status).json({ error: error.message });
        }
    },
    login: async (req, res) => {
        try {
            const { studentId, password, type } = req.body;
            const result = await auth_service_1.authService.login(studentId, password, type);
            res.cookie("token", result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
            return res.json({
                message: "Login successful",
                user: result.user,
                token: result.token,
                isAdmin: result.isAdmin,
                type: result.type
            });
        }
        catch (error) {
            // Return 403 for role mismatch errors
            const isForbidden = error.message.includes("admin portal") || error.message.includes("Admin accounts");
            const status = isForbidden ? 403 : (error.message.includes("required") || error.message.includes("format") ? 422 : 401);
            return res.status(status).json({ error: error.message });
        }
    },
    changePassword: async (req, res) => {
        try {
            const { studentId, oldPassword, newPassword } = req.body;
            await auth_service_1.authService.changePassword(studentId, oldPassword, newPassword);
            return res.json({ message: "Password changed successfully" });
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },
    changeStudentId: async (req, res) => {
        try {
            const { oldStudentId, newStudentId, password } = req.body;
            await auth_service_1.authService.changeStudentId(oldStudentId, newStudentId, password);
            return res.json({ message: "Student ID changed successfully" });
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
};
