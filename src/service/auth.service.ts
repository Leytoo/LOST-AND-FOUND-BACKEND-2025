import bcrypt from "bcryptjs";
import { authRepository } from "../repository/auth.repository";
import { generateToken } from "../utils/generateToken";
import { validateSignupInput, validateLoginInput } from "../utils/validation";
import { sanitizeUser } from "../utils/sanitizeUser";
import { PrismaClient } from '@prisma/client';
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();


export const authService = {
  async signup(name: string, studentId: string, password: string) {
    validateSignupInput(name, studentId, password);
    
    const existing = await authRepository.findByStudentId(studentId);
    if (existing) throw new Error("Student already exists");

    const hash = await bcrypt.hash(password, 10);

    const user = await authRepository.createUser(studentId, name, hash);

    return { user: sanitizeUser(user) };
  },

  async login(studentId: string, password: string, type?: string) {
  validateLoginInput(studentId, password);

  const user = await authRepository.findByStudentId(studentId);
  if (!user) throw new Error("Invalid credentials");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid credentials");

  // Role validation: check if login type matches user's admin status
  if (type === "user" && user.isAdmin) {
    throw new Error("Admin accounts must use admin portal");
  }
  if (type === "admin" && !user.isAdmin) {
    throw new Error("Only admin accounts can access admin portal");
  }

  // Set user as active in DB
  await prisma.user.update({
    where: { id: user.id },
    data: { active: true }
  });

  // Add a unique login timestamp to ensure every token is unique
  const token = generateToken(user.id, { loginAt: Date.now() });

  return { user: sanitizeUser({ ...user, active: true }), token, isAdmin: user.isAdmin, type: user.isAdmin ? "admin" : "user" };
},
  
  
  async changePassword(studentId: string, oldPassword: string, newPassword: string) {
    const user = await authRepository.findByStudentId(studentId);
    if (!user) throw new Error("User not found");
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) throw new Error("Old password is incorrect");
    if (oldPassword === newPassword) throw new Error("New password must be different");
    // Validate new password
    const { valid, message } = require("../utils/validation").validatePassword(newPassword);
    if (!valid) throw new Error(message);
    const newHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { studentId },
      data: { password: newHash }
    });
    return true;
  },

  async changeStudentId(oldStudentId: string, newStudentId: string, password: string) {
    // Validate new studentId
    const { validateStudentId } = require("../utils/validation");
    if (!validateStudentId(newStudentId)) throw new Error("New student ID must be an 8-digit number");
    const user = await authRepository.findByStudentId(oldStudentId);
    if (!user) throw new Error("User not found");
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Password is incorrect");
    // Check if new studentId already exists
    const existing = await authRepository.findByStudentId(newStudentId);
    if (existing) throw new Error("New student ID already exists");
    await prisma.user.update({
      where: { studentId: oldStudentId },
      data: { studentId: newStudentId }
    });
    return true;
  },

  async refreshToken(token: string) {
    // Replace 'your_jwt_secret' with your actual secret
    const payload = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret") as { userId: string };
    const newToken = generateToken(payload.userId, { loginAt: Date.now() });
    return { token: newToken };
  },

  async setInactive(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { active: false }
    });
    return true;
  },
};


