import type { Request, Response } from "express";

const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).send({ success: false, message: "Resource not found!" });
};

export default notFoundHandler;
