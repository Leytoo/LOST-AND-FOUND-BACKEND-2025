import { prisma } from "../prisma/client";

const userSelect = { id: true, name: true, studentId: true } as const;
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
} as const;

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
      select: lostItemSelect,
      orderBy: { createdAt: "desc" },
    });
  },

  findById: (id: string) => {
    return prisma.lostItem.findUnique({
      where: { id },
      select: lostItemSelect,
    });
  },

  update: (
    id: string,
    data: Partial<{ title: string; description: string; status: string; isFound: boolean }>
  ) => {
    return prisma.lostItem.update({
      where: { id },
      data,
      select: lostItemSelect,
    });
  },

  delete: (id: string) => {
    return prisma.lostItem.delete({ where: { id } });
  },
};
