import type { Router } from "express";

import middleware from "@/middleware";
import { authenticate, authorize } from "@/middleware/auth.middleware";

import applicationController from "../controllers/application.controller";
import validators from "../validators";

const applicationRoutes = (api: Router) => {
  api.post(
    "/applications",
    authenticate,
    authorize("user", "admin"),
    middleware.commonJoiSchemaValidator(validators.insertApplicationSchema),
    applicationController.applicationInsert,
  );

  api.get(
    "/applications",
    authenticate,
    authorize("user", "admin"),
    middleware.commonJoiSchemaValidator(validators.applicationQuerySchema),
    applicationController.getApplications,
  );

  api.get(
    "/applications/:id",
    authenticate,
    authorize("user", "admin"),
    middleware.commonJoiSchemaValidator(validators.applicationIdSchema),
    applicationController.getApplicationById,
  );

  api.put(
    "/applications/:id",
    authenticate,
    authorize("admin"),
    middleware.commonJoiSchemaValidator(validators.updateApplicationSchema),
    applicationController.updateApplicationStatus,
  );

  api.delete(
    "/applications/:id",
    authenticate,
    authorize("admin"),
    middleware.commonJoiSchemaValidator(validators.applicationIdSchema),
    applicationController.deleteApplication,
  );

  return api;
};

export default applicationRoutes;
