import type { Request, Response } from "express";
import { Router } from "express";

import applicationRoutes from "@/modules/v1/application/routes/application.routes";
import authRoutes from "@/modules/v1/auth/routes/auth.routes";
import petRoutes from "@/modules/v1/pet/routes/pet.routes";

export default () => {
  const api: Router = Router();

  authRoutes(api);
  petRoutes(api);
  applicationRoutes(api);

  api.get("/", (req: Request, res: Response) => {
    res.json({
      service: "pet management api",
      version: "1.0",
    });
  });

  return api;
};
