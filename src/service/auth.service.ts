import bcrypt from "bcryptjs";
import { authRepository } from "../repository/auth.repository";
import { generateToken } from "../utils/generateToken";
import { validateSignupInput, validateLoginInput } from "../utils/validation";
import { sanitizeUser } from "../utils/sanitizeUser";

export const authService = {
  async signup(name: string, studentId: string, password: string) {
    validateSignupInput(name, studentId, password);
    
    const existing = await authRepository.findByStudentId(studentId);
    if (existing) throw new Error("Student already exists");

    const hash = await bcrypt.hash(password, 10);

    const user = await authRepository.createUser(studentId, name, hash);

    return { user: sanitizeUser(user) };
  },

  async login(studentId: string, password: string) {
    validateLoginInput(studentId, password);
    
    const user = await authRepository.findByStudentId(studentId);
    if (!user) throw new Error("Invalid credentials");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid credentials");

    const token = generateToken(user.id);

    return { user: sanitizeUser(user), token };
  }
};
