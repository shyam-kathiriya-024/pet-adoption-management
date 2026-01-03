import type { Response } from "express";

import type { IBodyRequest } from "@/types/request/request.types";
import errorManager from "@/utils/error-manager";
import httpResponse from "@/utils/http-response";
import Logger from "@/utils/logger";

import authService from "../services/auth.service";

const logger = Logger.getInstance("AuthController");

interface IRegisterBody {
  user_name: string;
  user_email: string;
  user_password: string;
}

interface ILoginBody {
  user_email: string;
  user_password: string;
}

const register = async (req: IBodyRequest<IRegisterBody>, res: Response) => {
  try {
    const response = await authService.register(req.body);
    logger.info("User registered successfully", { requestId: req.requestId, email: req.body.user_email });
    httpResponse.sendSuccess(res, response);
  } catch (err) {
    httpResponse.sendFailure(req, res, err);
  }
};

const login = async (req: IBodyRequest<ILoginBody>, res: Response) => {
  try {
    const response = await authService.login(req.body);
    logger.info("User logged in successfully", { requestId: req.requestId, email: req.body.user_email });
    httpResponse.sendSuccess(res, response);
  } catch (err) {
    httpResponse.sendFailure(req, res, err);
  }
};

const getMe = async (req: IBodyRequest<unknown>, res: Response) => {
  try {
    if (!req.user) {
      logger.warn("Unauthorized access attempt", { requestId: req.requestId });
      throw errorManager.getHttpError("UNAUTHORIZED");
    }
    const response = await authService.getMe(req.user.user_id);
    logger.info("User profile fetched successfully", { requestId: req.requestId, userId: req.user.user_id });
    httpResponse.sendSuccess(res, response);
  } catch (err) {
    httpResponse.sendFailure(req, res, err);
  }
};

export default {
  register,
  login,
  getMe,
};
