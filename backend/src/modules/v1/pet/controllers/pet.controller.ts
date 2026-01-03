import type { Response } from "express";

import type { IBodyRequest, IParamsRequest, IQueryRequest } from "@/types/request/request.types";
import errorManager from "@/utils/error-manager";
import httpResponse from "@/utils/http-response";
import Logger from "@/utils/logger";

import type { IPetInsert, IPetQuery, IPetUpdate } from "../types";
import petService from "../services/pet.service";

const logger = Logger.getInstance("PetController");

const petInsert = async (req: IBodyRequest<IPetInsert>, res: Response) => {
  try {
    const response = await petService.petInsert(req.body);
    logger.info("Pet inserted successfully", { requestId: req.requestId });
    httpResponse.sendSuccess(res, response);
  } catch (err) {
    httpResponse.sendFailure(req, res, err);
  }
};

const getPets = async (req: IQueryRequest<IPetQuery>, res: Response) => {
  try {
    const response = await petService.getPets(req.query);
    logger.info("Pets fetched successfully", { requestId: req.requestId });
    httpResponse.sendSuccess(res, response);
  } catch (err) {
    httpResponse.sendFailure(req, res, err);
  }
};

const getPetById = async (req: IParamsRequest<{ id: string }>, res: Response) => {
  try {
    const response = await petService.getPetById(req.params.id);
    if (!response) {
      logger.warn("Pet not found", { requestId: req.requestId, petId: req.params.id });
      throw errorManager.getHttpError("PET_NOT_FOUND");
    }
    logger.info("Pet fetched successfully", { requestId: req.requestId });
    httpResponse.sendSuccess(res, response);
  } catch (err) {
    httpResponse.sendFailure(req, res, err);
  }
};

const updatePet = async (req: IBodyRequest<IPetUpdate> & IParamsRequest<{ id: string }>, res: Response) => {
  try {
    const response = await petService.updatePet(req.params.id, req.body);
    if (!response) {
      logger.warn("Pet not found for update", { requestId: req.requestId, petId: req.params.id });
      throw errorManager.getHttpError("PET_NOT_FOUND");
    }
    logger.info("Pet updated successfully", { requestId: req.requestId });
    httpResponse.sendSuccess(res, response);
  } catch (err) {
    httpResponse.sendFailure(req, res, err);
  }
};

const deletePet = async (req: IParamsRequest<{ id: string }>, res: Response) => {
  try {
    const response = await petService.deletePet(req.params.id);
    if (!response) {
      logger.warn("Pet not found for deletion", { requestId: req.requestId, petId: req.params.id });
      throw errorManager.getHttpError("PET_NOT_FOUND");
    }
    logger.info("Pet deleted successfully", { requestId: req.requestId });
    httpResponse.sendSuccess(res, { message: "Pet deleted successfully" });
  } catch (err) {
    httpResponse.sendFailure(req, res, err);
  }
};

export default {
  petInsert,
  getPets,
  getPetById,
  updatePet,
  deletePet,
};
