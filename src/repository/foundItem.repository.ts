import { prisma } from "../prisma/client";

export const foundItemRepository = {
  create: (data: { title: string; description: string; category: string; location: string; image?: string; postedBy: string }) => {
    return prisma.foundItem.create({ data });
  },

  findAll: (filters?: { category?: string }) => {
    return prisma.foundItem.findMany({
      where: {
        ...(filters?.category && { category: filters.category }),
      },
      include: { user: { select: { id: true, name: true, studentId: true } } },
      orderBy: { createdAt: "desc" },
    });
  },

  findById: (id: string) => {
    return prisma.foundItem.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true, studentId: true } } },
    });
  },

  update: (id: string, data: Partial<{ title: string; description: string }>) => {
    return prisma.foundItem.update({
      where: { id },
      data,
      include: { user: { select: { id: true, name: true, studentId: true } } },
    });
  },

  delete: (id: string) => {
    return prisma.foundItem.delete({ where: { id } });
  },
};
