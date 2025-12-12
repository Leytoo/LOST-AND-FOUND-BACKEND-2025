"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
async function main() {
    try {
        // Check if admin already exists
        const existingAdmin = await client_1.prisma.user.findUnique({
            where: { studentId: "13572468" },
        });
        if (existingAdmin) {
            console.log("✅ Admin user already exists");
            return;
        }
        // Hash the admin password
        const hashedPassword = await bcryptjs_1.default.hash("Admin@1234", 10);
        // Create admin user
        const admin = await client_1.prisma.user.create({
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
    }
    catch (error) {
        console.error("❌ Error seeding admin:", error);
        process.exit(1);
    }
    finally {
        await client_1.prisma.$disconnect();
    }
}
main();
// "prisma": {
//   "seed": "ts-node ./src/seed/seedAdmin.ts"
// }
