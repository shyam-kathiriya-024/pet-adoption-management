import { authenticate, authorize } from "./auth.middleware";
import commonJoiSchemaValidator from "./joi-schema-validator";
import notFoundHandler from "./not-found.middleware";
import requestLogger from "./request-logger.middelware";
import requestIdMiddleware from "./requestId.middleware";

export default {
  notFoundHandler,
  commonJoiSchemaValidator,
  requestLogger,
  requestIdMiddleware,
  authenticate,
  authorize,
};
