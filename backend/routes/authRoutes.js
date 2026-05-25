// ===============================
// 📁 routes/authRoutes.js
// ===============================

import express from "express";
import {protect} from "../middlewares/authMiddleware.js";
import {
  signup,
  login,
  logout,
  getMe,
} from "../controllers/authController.js";
import { authLimiter } from "../middlewares/rateLimitMiddlewares.js";

const authRouter = express.Router();

authRouter.post("/signup", authLimiter ,signup);

authRouter.post("/login", authLimiter, login);

authRouter.post("/logout", protect, logout);

authRouter.get("/me",protect,getMe);

export default authRouter;