import bcrypt from "bcryptjs";
import { authRepository } from "../repository/auth.repository";
import { generateToken } from "../utils/generateToken";

export const authService = {
  async signup(name: string, email: string, password: string) {
    const existing = await authRepository.findByEmail(email);
    if (existing) throw new Error("Email already taken");

    const hash = await bcrypt.hash(password, 10);

    const user = await authRepository.createUser(email, name, hash);

    const token = generateToken(user.id);

    return { user, token };
  },

  async login(email: string, password: string) {
    const user = await authRepository.findByEmail(email);
    if (!user) throw new Error("Invalid credentials");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid credentials");

    const token = generateToken(user.id);

    return { user, token };
  }
};
