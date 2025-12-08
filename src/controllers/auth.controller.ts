import { Request, Response } from "express";
import { authService } from "../service/auth.service";

export const authController = {
  signup: async (req: Request, res: Response) => {
    try {
      const { name, studentId, password } = req.body;
      const result = await authService.signup(name, studentId, password);

      return res.status(201).json({
        message: "Student registered successfully. Please login to continue.",
        user: result.user
      });
    } catch (error: any) {
      const status = error.message.includes("required") || error.message.includes("format") || error.message.includes("must") ? 422 : 400;
      return res.status(status).json({ error: error.message });
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { studentId, password } = req.body;
      const result = await authService.login(studentId, password);

      res.cookie("token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      return res.json({
        message: "Login successful",
        user: result.user,
        token: result.token
      });
    } catch (error: any) {
      const status = error.message.includes("required") || error.message.includes("format") ? 422 : 401;
      return res.status(status).json({ error: error.message });
    }
  }
};
