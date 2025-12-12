"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.conversationRepository = void 0;
const client_1 = require("../prisma/client");
exports.conversationRepository = {
    create: (data) => {
        return client_1.prisma.conversation.create({
            data,
            include: {
                messages: {
                    include: { sender: { select: { id: true, name: true } } },
                    orderBy: { createdAt: "asc" }
                },
                user: { select: { id: true, name: true, studentId: true } },
                foundItem: { select: { id: true, title: true, location: true, user: { select: { id: true, name: true } } } },
            },
        });
    },
    findByUserAndItem: (userId, foundItemId) => {
        return client_1.prisma.conversation.findFirst({
            where: { userId, foundItemId },
            include: {
                messages: {
                    include: { sender: { select: { id: true, name: true } } },
                    orderBy: { createdAt: "asc" }
                },
                user: { select: { id: true, name: true, studentId: true } },
                foundItem: { select: { id: true, title: true, location: true, user: { select: { id: true, name: true } } } },
            },
        });
    },
    findByUserId: (userId) => {
        return client_1.prisma.conversation.findMany({
            where: { userId },
            include: {
                messages: {
                    include: { sender: { select: { id: true, name: true } } },
                    orderBy: { createdAt: "desc" },
                    take: 1
                },
                user: { select: { id: true, name: true, studentId: true } },
                foundItem: { select: { id: true, title: true, location: true, user: { select: { id: true, name: true } } } },
            },
            orderBy: { updatedAt: "desc" },
        });
    },
    findAll: () => {
        return client_1.prisma.conversation.findMany({
            include: {
                messages: {
                    include: { sender: { select: { id: true, name: true } } },
                    orderBy: { createdAt: "asc" },
                },
                user: { select: { id: true, name: true, studentId: true } },
                foundItem: { select: { id: true, title: true, location: true, user: { select: { id: true, name: true } } } },
            },
            orderBy: { updatedAt: "desc" },
        });
    },
    findById: (id) => {
        return client_1.prisma.conversation.findUnique({
            where: { id },
            include: {
                messages: {
                    include: { sender: { select: { id: true, name: true } } },
                    orderBy: { createdAt: "asc" }
                },
                user: { select: { id: true, name: true, studentId: true } },
                foundItem: { select: { id: true, title: true, location: true, user: { select: { id: true, name: true } } } },
            },
        });
    },
    updateStatus: (id, status) => {
        return client_1.prisma.conversation.update({
            where: { id },
            data: { status },
            include: {
                messages: {
                    include: { sender: { select: { id: true, name: true } } },
                    orderBy: { createdAt: "asc" }
                },
                user: { select: { id: true, name: true, studentId: true } },
                foundItem: { select: { id: true, title: true, location: true, user: { select: { id: true, name: true } } } },
            },
        });
    },
    delete: (id) => {
        return client_1.prisma.conversation.delete({
            where: { id },
        });
    },
};
