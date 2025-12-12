import { prisma } from "../prisma/client";
import bcrypt from "bcryptjs";

async function main() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { studentId: "13572468" },
    });

    if (existingAdmin) {
      console.log("✅ Admin user already exists");
      return;
    }

    // Hash the admin password
    const hashedPassword = await bcrypt.hash("Admin@1234", 10);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        studentId: "13572468",
        name: "SAO Admin",
        password: hashedPassword,
        isAdmin: true,
      },
    });

    console.log("✅ Admin user created successfully");
    console.log(`📧 StudentId: ${admin.studentId}`);
    console.log(`🔑 Password: Admin@1234`);
    console.log(`👤 Name: ${admin.name}`);
    console.log(`⚡ Admin Status: ${admin.isAdmin}`);
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

// "prisma": {
//   "seed": "ts-node ./src/seed/seedAdmin.ts"
// }
