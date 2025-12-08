import { Request, Response } from "express";
import { authService } from "../service/auth.service";

export const authController = {
  signup: async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;
      const result = await authService.signup(name, email, password);

      return res.status(201).json({
        message: "User registered",
        user: result.user,
        token: result.token
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);

      return res.json({
        message: "Login successful",
        user: result.user,
        token: result.token
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
};
