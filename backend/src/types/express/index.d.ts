import type { IUser } from "@/models/user/user.types";

import "express";

// Define the namespace augmentation for 'express'
declare module "express-serve-static-core" {
  export interface Request {
    requestId?: string; // Use 'string | undefined' or 'string' if you guarantee it's always set
    user?: IUser; // Use 'IUser | undefined' or 'IUser' if you guarantee it's always set
  }
}
