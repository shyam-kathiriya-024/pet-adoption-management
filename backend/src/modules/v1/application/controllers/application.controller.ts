import type { Response } from "express";

import type { IBodyRequest, IParamsRequest, IQueryRequest } from "@/types/request/request.types";
import errorManager from "@/utils/error-manager";
import httpResponse from "@/utils/http-response";
import Logger from "@/utils/logger";

import type { IApplicationInsert, IApplicationQuery, IApplicationUpdate } from "../types";
import applicationService from "../services/application.service";

const logger = Logger.getInstance("ApplicationController");

const applicationInsert = async (req: IBodyRequest<IApplicationInsert>, res: Response) => {
  try {
    const response = await applicationService.applicationInsert(req.body);
    logger.info("Application submitted successfully", { requestId: req.requestId });
    httpResponse.sendSuccess(res, response);
  } catch (err) {
    httpResponse.sendFailure(req, res, err);
  }
};

const getApplications = async (req: IQueryRequest<IApplicationQuery>, res: Response) => {
  try {
    const response = await applicationService.getApplications(req.query);
    logger.info("Applications fetched successfully", { requestId: req.requestId });
    httpResponse.sendSuccess(res, response);
  } catch (err) {
    httpResponse.sendFailure(req, res, err);
  }
};

const getApplicationById = async (req: IParamsRequest<{ id: string }>, res: Response) => {
  try {
    const response = await applicationService.getApplicationById(req.params.id);
    if (!response) {
      logger.warn("Application not found", { requestId: req.requestId, applicationId: req.params.id });
      throw errorManager.getHttpError("APPLICATION_NOT_FOUND");
    }
    logger.info("Application fetched successfully", { requestId: req.requestId });
    httpResponse.sendSuccess(res, response);
  } catch (err) {
    httpResponse.sendFailure(req, res, err);
  }
};

const updateApplicationStatus = async (
  req: IBodyRequest<IApplicationUpdate> & IParamsRequest<{ id: string }>,
  res: Response,
) => {
  try {
    const response = await applicationService.updateApplicationStatus(req.params.id, req.body);
    if (!response) {
      logger.warn("Application not found for status update", {
        requestId: req.requestId,
        applicationId: req.params.id,
      });
      throw errorManager.getHttpError("APPLICATION_NOT_FOUND");
    }
    logger.info("Application status updated successfully", { requestId: req.requestId });
    httpResponse.sendSuccess(res, response);
  } catch (err) {
    httpResponse.sendFailure(req, res, err);
  }
};

const deleteApplication = async (req: IParamsRequest<{ id: string }>, res: Response) => {
  try {
    const response = await applicationService.deleteApplication(req.params.id);
    if (!response) {
      logger.warn("Application not found for deletion", { requestId: req.requestId, applicationId: req.params.id });
      throw errorManager.getHttpError("APPLICATION_NOT_FOUND");
    }
    logger.info("Application deleted successfully", { requestId: req.requestId });
    httpResponse.sendSuccess(res, { message: "Application deleted successfully" });
  } catch (err) {
    httpResponse.sendFailure(req, res, err);
  }
};

export default {
  applicationInsert,
  getApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
};
