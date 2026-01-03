import Joi from "joi";

import type { EnvVars, IServerConfig } from "@/types";

import "dotenv/config";

const envValidationSchema = Joi.object<EnvVars>({
  PORT: Joi.number().required(),
  NODE_ENV: Joi.string().valid("production", "development", "stage", "test").required(),
  DB_URI: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default("7d"),
}).unknown(true);

const validationResult = envValidationSchema.validate(process.env);
const error = validationResult.error;
const envVars: EnvVars = validationResult.value as EnvVars;

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const env: IServerConfig = {
  port: envVars.PORT,
  environment: envVars.NODE_ENV,
  db_uri: envVars.DB_URI,
  jwt_secret: envVars.JWT_SECRET,
  jwt_expires_in: envVars.JWT_EXPIRES_IN || "7d",
};

export default env;
