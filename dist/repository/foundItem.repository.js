"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.foundItemRepository = void 0;
const client_1 = require("../prisma/client");
const userSelect = { id: true, name: true, studentId: true };
const foundItemSelect = {
    id: true,
    title: true,
    description: true,
    category: true,
    location: true,
    image: true,
    status: true,
    isFound: true,
    claimedAt: true,
    postedBy: true,
    createdAt: true,
    updatedAt: true,
    user: { select: userSelect },
};
exports.foundItemRepository = {
    create: (data) => {
        return client_1.prisma.foundItem.create({ data });
    },
    findAll: (filters) => {
        return client_1.prisma.foundItem.findMany({
            where: {
                ...(filters?.category && { category: filters.category }),
            },
            select: foundItemSelect,
            orderBy: { createdAt: "desc" },
        });
    },
    findById: (id) => {
        return client_1.prisma.foundItem.findUnique({
            where: { id },
            select: foundItemSelect,
        });
    },
    update: (id, data) => {
        return client_1.prisma.foundItem.update({
            where: { id },
            data,
            select: foundItemSelect,
        });
    },
    delete: (id) => {
        return client_1.prisma.foundItem.delete({ where: { id } });
    },
};
