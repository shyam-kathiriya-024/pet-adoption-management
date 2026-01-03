import type { Request } from "express";
import morgan from "morgan";

import Logger from "@/utils/logger";

const logger = Logger.getInstance("HTTP");

// Determine log level based on status code
const getLogLevel = (status: number) => {
  if (status >= 500) return "error"; // Server errors
  if (status >= 400) return "warn"; // Client errors
  return "info"; // Success or redirects
};

const getRequestId = (req: Request) => req.requestId ?? "unknown";

// Morgan token for status code (works even if response not finished yet)
// token("statusCode", (req, res) => (res.statusCode ?? 0).toString());

// Log request immediately
const logRequestStart = morgan(
  (tokens, req, res) => {
    const msg = `${tokens.method(req, res)} ${tokens.url(req, res)}`;
    logger.info(`Incoming request: ${msg}`, { requestId: getRequestId(req as Request) });
    return null;
  },
  { immediate: true },
);

// Log response after finish
const logResponseEnd = morgan((tokens, req, res) => {
  const status = parseInt(tokens.status(req, res) ?? "0", 10);
  const level = getLogLevel(status);
  const msg = [
    "Completed request:",
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, "content-length"),
    "-",
    tokens["response-time"](req, res),
    "ms",
  ].join(" ");

  logger[level](msg, { requestId: getRequestId(req as Request) });
  return null;
});

// Export combined middleware
export default [logRequestStart, logResponseEnd];
