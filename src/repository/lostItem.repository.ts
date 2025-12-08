import { prisma } from "../prisma/client";

export const lostItemRepository = {
  create: (data: { title: string; description: string; category: string; location: string; image?: string; postedBy: string }) => {
    return prisma.lostItem.create({ data });
  },

  findAll: (filters?: { status?: string; category?: string }) => {
    return prisma.lostItem.findMany({
      where: {
        ...(filters?.status && { status: filters.status }),
        ...(filters?.category && { category: filters.category }),
      },
      include: { user: { select: { id: true, name: true, studentId: true } } },
      orderBy: { createdAt: "desc" },
    });
  },

  findById: (id: string) => {
    return prisma.lostItem.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true, studentId: true } } },
    });
  },

  update: (id: string, data: Partial<{ title: string; description: string; status: string }>) => {
    return prisma.lostItem.update({
      where: { id },
      data,
      include: { user: { select: { id: true, name: true, studentId: true } } },
    });
  },

  delete: (id: string) => {
    return prisma.lostItem.delete({ where: { id } });
  },
};
