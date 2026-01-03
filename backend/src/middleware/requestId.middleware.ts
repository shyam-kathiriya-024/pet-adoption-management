import type { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

const requestIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const requestId = req.headers["x-request-id"] ?? uuidv4();

  // Attach to request object
  req.requestId = requestId as string;

  // Send it back in response headers
  res.setHeader("x-request-id", requestId);

  next();
};

export default requestIdMiddleware;
