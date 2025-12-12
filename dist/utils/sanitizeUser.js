"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeUser = void 0;
const sanitizeUser = (user) => {
    const { password, ...safeUser } = user;
    return safeUser;
};
exports.sanitizeUser = sanitizeUser;
