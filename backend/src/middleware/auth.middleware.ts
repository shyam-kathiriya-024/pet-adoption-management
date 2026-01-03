import type { NextFunction, Response } from "express";
import passport from "passport";

import type { IUser } from "@/models/user/user.types";
import type { IBodyRequest } from "@/types/request/request.types";
import errorManager from "@/utils/error-manager";
import httpResponse from "@/utils/http-response";

export const authenticate = (req: IBodyRequest<unknown>, res: Response, next: NextFunction) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  passport.authenticate("jwt", { session: false }, (err: Error, user: IUser | false) => {
    console.log(err, user);
    if (err) {
      return httpResponse.sendFailure(req, res, err);
    }
    if (!user) {
      return httpResponse.sendFailure(req, res, errorManager.getHttpError("UNAUTHORIZED"));
    }
    req.user = user;
    next();
  })(req, res, next);
};

export const authorize = (...roles: ("user" | "admin")[]) => {
  return (req: IBodyRequest<unknown>, res: Response, next: NextFunction) => {
    if (!req.user) {
      return httpResponse.sendFailure(req, res, errorManager.getHttpError("UNAUTHORIZED"));
    }

    const allowedRoles = roles as ("user" | "admin")[];

    if (req.user && !allowedRoles.includes(req.user.user_role)) {
      return httpResponse.sendFailure(req, res, errorManager.getHttpError("FORBIDDEN"));
    }

    next();
  };
};
