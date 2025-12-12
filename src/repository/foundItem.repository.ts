import { prisma } from "../prisma/client";

const userSelect = { id: true, name: true, studentId: true } as const;
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
} as const;

export const foundItemRepository = {
  create: (data: { title: string; description: string; category: string; location: string; image?: string; postedBy: string }) => {
    return prisma.foundItem.create({ data });
  },

  findAll: (filters?: { category?: string }) => {
    return prisma.foundItem.findMany({
      where: {
        ...(filters?.category && { category: filters.category }),
      },
      select: foundItemSelect,
      orderBy: { createdAt: "desc" },
    });
  },

  findById: (id: string) => {
    return prisma.foundItem.findUnique({
      where: { id },
      select: foundItemSelect,
    });
  },

  update: (
    id: string,
    data: Partial<{ title: string; description: string; category: string; location: string; image?: string; isFound: boolean; status: string; claimedAt: Date | null }>
  ) => {
    return prisma.foundItem.update({
      where: { id },
      data,
      select: foundItemSelect,
    });
  },

  delete: (id: string) => {
    return prisma.foundItem.delete({ where: { id } });
  },
};
