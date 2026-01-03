import type { NextFunction, Request, Response } from "express";
import type Joi from "joi";
import type { ValidationError } from "joi";

import httpResponse from "@/utils/http-response";

/**
 * @function commonValidator
 * @description A middleware function for common request validation using Joi.
 * @param {RequestValidationSchema} inputSchema - The schema definition for validation.
 * @returns {Function} An Express middleware function.
 */
const commonJoiSchemaValidator = (
  inputSchema: Joi.ObjectSchema,
): ((req: Request, res: Response, next: NextFunction) => void) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const data = { body: req.body as Record<string, unknown>, params: req.params, query: req.query };
    const validationResult: {
      error?: ValidationError;
      value?: Record<string, unknown>;
    } = inputSchema.validate(data, { stripUnknown: true, abortEarly: false });
    const { error, value } = validationResult;

    if (error) {
      const errorMessage = (error.details || []).map((ele) => ele.message || "").join(", ");
      const err = httpResponse.makeError("422", errorMessage, "");
      httpResponse.sendFailure(req, res, err, error.details);
    } else {
      // Always assign all three if present
      if (typeof value === "object" && value !== null) {
        if ("body" in value && value.body !== undefined) {
          req.body = value.body as Record<string, unknown>;
        }
        if ("params" in value && value.params !== undefined) {
          req.params = value.params as typeof req.params;
        }
        if ("query" in value && value.query !== undefined) {
          req.query = value.query as typeof req.query;
        }
      }
      next();
    }
  };
};

export default commonJoiSchemaValidator;
