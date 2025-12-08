import { prisma } from "./src/prisma/client";

async function verify() {
  try {
    const admin = await prisma.user.findUnique({
      where: { studentId: "ADMIN2025" }
    });
    console.log("✅ Admin user found:");
    console.log(JSON.stringify(admin, null, 2));
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

verify();
