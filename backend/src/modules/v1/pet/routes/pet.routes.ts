import type { Router } from "express";

import middleware from "@/middleware";
import { authenticate, authorize } from "@/middleware/auth.middleware";

import petController from "../controllers/pet.controller";
import validators from "../validators";

const petRoutes = (api: Router) => {
  // Public routes - anyone can view pets
  api.get("/pets", middleware.commonJoiSchemaValidator(validators.petQuerySchema), petController.getPets);
  api.get("/pets/:id", middleware.commonJoiSchemaValidator(validators.petIdSchema), petController.getPetById);

  // Admin only routes - create, update, delete pets
  api.post(
    "/pets",
    authenticate,
    authorize("admin"),
    middleware.commonJoiSchemaValidator(validators.insertPetSchema),
    petController.petInsert,
  );
  api.put(
    "/pets/:id",
    authenticate,
    authorize("admin"),
    middleware.commonJoiSchemaValidator(validators.updatePetSchema),
    petController.updatePet,
  );
  api.delete(
    "/pets/:id",
    authenticate,
    authorize("admin"),
    middleware.commonJoiSchemaValidator(validators.petIdSchema),
    petController.deletePet,
  );

  return api;
};

export default petRoutes;
