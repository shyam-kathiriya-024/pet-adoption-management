export interface IServerConfig {
  port: number;
  environment: string;
  db_uri: string;
  jwt_secret: string;
  jwt_expires_in: string;
}

export interface IErrorConfig {
  CODE: number;
  DEFAULT_MESSAGE: string;
  HTTP_CODE: number;
}

export type EnvVars = {
  PORT: number;
  NODE_ENV: "production" | "development" | "stage" | "test";
  DB_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN?: string;
};
