import { Request, Response } from "express";
import { authService } from "../service/auth.service";
import { pusher } from "../config/pusher.config";

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
    const { studentId, password, type } = req.body;
    const result = await authService.login(studentId, password, type);

    res.cookie("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // Add this block here:
    await pusher.trigger("users", "user-status-changed", {
      userId: result.user.id,
      active: true,
    });

    return res.json({
      message: "Login successful",
      user: result.user,
      token: result.token,
      isAdmin: result.isAdmin,
      type: result.type
    });
  } catch (error: any) {
    // ...existing error handling...
  }
},
logout: async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    await authService.setInactive(userId);

    res.clearCookie("token");
    return res.json({ message: "Logout successful" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
},

  
  changePassword: async (req: Request, res: Response) => {
    try {
      const { studentId, oldPassword, newPassword } = req.body;
      await authService.changePassword(studentId, oldPassword, newPassword);
      return res.json({ message: "Password changed successfully" });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  },

  changeStudentId: async (req: Request, res: Response) => {
    try {
      const { oldStudentId, newStudentId, password } = req.body;
      await authService.changeStudentId(oldStudentId, newStudentId, password);
      return res.json({ message: "Student ID changed successfully" });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  },

  refresh: async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      if (!token) return res.status(401).json({ error: "Unauthorized" });
      const result = await authService.refreshToken(token);

      res.cookie("token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      return res.json({
        message: "Token refreshed",
        token: result.token
      });
    } catch (error: any) {
      return res.status(401).json({ error: error.message });
    }
  }
};


