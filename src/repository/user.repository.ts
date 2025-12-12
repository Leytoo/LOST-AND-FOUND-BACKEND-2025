import { prisma } from "../prisma/client";

export const userRepository = {
  countActive: () => prisma.user.count({ where: { active: true } }),
  findAllActive: () => prisma.user.findMany({ where: { active: true } }),
};
