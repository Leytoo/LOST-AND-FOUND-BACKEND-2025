"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lostItemRepository = void 0;
const client_1 = require("../prisma/client");
const userSelect = { id: true, name: true, studentId: true };
const lostItemSelect = {
    id: true,
    title: true,
    description: true,
    category: true,
    location: true,
    image: true,
    status: true,
    isFound: true,
    postedBy: true,
    createdAt: true,
    updatedAt: true,
    user: { select: userSelect },
};
exports.lostItemRepository = {
    create: (data) => {
        return client_1.prisma.lostItem.create({ data });
    },
    findAll: (filters) => {
        return client_1.prisma.lostItem.findMany({
            where: {
                ...(filters?.status && { status: filters.status }),
                ...(filters?.category && { category: filters.category }),
            },
            select: lostItemSelect,
            orderBy: { createdAt: "desc" },
        });
    },
    findById: (id) => {
        return client_1.prisma.lostItem.findUnique({
            where: { id },
            select: lostItemSelect,
        });
    },
    update: (id, data) => {
        return client_1.prisma.lostItem.update({
            where: { id },
            data,
            select: lostItemSelect,
        });
    },
    delete: (id) => {
        return client_1.prisma.lostItem.delete({ where: { id } });
    },
};
