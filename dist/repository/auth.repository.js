"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRepository = void 0;
const client_1 = require("../prisma/client");
exports.authRepository = {
    findByStudentId: (studentId) => {
        return client_1.prisma.user.findUnique({
            where: { studentId }
        });
    },
    createUser: (studentId, name, hashedPassword) => {
        return client_1.prisma.user.create({
            data: {
                studentId,
                name,
                password: hashedPassword,
            }
        });
    }
};
