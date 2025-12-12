"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLoginInput = exports.validateSignupInput = exports.validatePassword = exports.validateStudentId = void 0;
const validateStudentId = (studentId) => {
    // Accept only 8-digit integer student ID (e.g., "20250001")
    const studentIdRegex = /^\d{8}$/;
    return studentIdRegex.test(studentId);
};
exports.validateStudentId = validateStudentId;
const validatePassword = (password) => {
    if (password.length < 8) {
        return { valid: false, message: "Password must be at least 8 characters long" };
    }
    if (!/[A-Z]/.test(password)) {
        return { valid: false, message: "Password must contain at least one uppercase letter" };
    }
    if (!/[a-z]/.test(password)) {
        return { valid: false, message: "Password must contain at least one lowercase letter" };
    }
    if (!/[0-9]/.test(password)) {
        return { valid: false, message: "Password must contain at least one number" };
    }
    return { valid: true };
};
exports.validatePassword = validatePassword;
const validateSignupInput = (name, studentId, password) => {
    if (!name || !studentId || !password) {
        throw new Error("Name, student ID, and password are required");
    }
    if (!(0, exports.validateStudentId)(studentId)) {
        throw new Error("Student ID must be an 8-digit number");
    }
    const passwordValidation = (0, exports.validatePassword)(password);
    if (!passwordValidation.valid) {
        throw new Error(passwordValidation.message);
    }
};
exports.validateSignupInput = validateSignupInput;
const validateLoginInput = (studentId, password) => {
    if (!studentId || !password) {
        throw new Error("Student ID and password are required");
    }
    if (!(0, exports.validateStudentId)(studentId)) {
        throw new Error("Student ID must be an 8-digit number");
    }
};
exports.validateLoginInput = validateLoginInput;
