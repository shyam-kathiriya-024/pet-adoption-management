import type { Router } from "express";

import middleware from "@/middleware";
import { authenticate } from "@/middleware/auth.middleware";

import authController from "../controllers/auth.controller";
import validators from "../validators";

const authRoutes = (api: Router) => {
  // Public routes
  api.post("/auth/login", middleware.commonJoiSchemaValidator(validators.loginSchema), authController.login);
  api.post("/auth/register", middleware.commonJoiSchemaValidator(validators.registerSchema), authController.register);

  // Protected routes - requires authentication
  api.get("/auth/me", authenticate, authController.getMe);

  return api;
};

export default authRoutes;
