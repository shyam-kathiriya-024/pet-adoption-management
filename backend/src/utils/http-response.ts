import type { Request, Response } from "express";

import config from "@/config";

const makeError = (code: string, message: string, msg_code: string): AppError => {
  const httpCode = config.httpCode["ERROR_" + code];
  let error: AppError;

  try {
    const codeNum = typeof httpCode.CODE === "string" ? parseInt(httpCode.CODE, 10) : httpCode.CODE;
    error = {
      httpCode: codeNum,
      message: message || httpCode.MESSAGE,
      code: msg_code,
    };
  } catch {
    const rangeErr = new RangeError(
      `The provided [code] http code:${JSON.stringify(code)} is not valid. Please check the http config file.`,
    );
    throw rangeErr;
  }
  return error;
};

const sendSuccess = (res: Response, result?: unknown) => {
  const data = {
    success: true,
    status: config.httpCode.SUCCESS_200.CODE,
    message: config.httpCode.SUCCESS_200.MESSAGE,
    data: result && typeof result === "object" && "data" in result ? result.data : result,
  };

  res.status(config.httpCode.SUCCESS_200.CODE).json(data);
};

interface AppError {
  httpCode?: number;
  message?: string;
  key?: string;
  code?: string | number;
}

const sendFailure = (req: Request, res: Response, error: unknown, errors?: unknown[]): void => {
  let errObj: AppError;

  if (!error || (typeof error === "object" && error !== null && !(error as AppError).httpCode)) {
    // errorManager.serviceErrorHandler(req, res, error);
    // global error
    // db log
    // external
    errObj = makeError("500", "", "");
  } else if (typeof error === "object" && error !== null) {
    errObj = error as AppError;
  } else if (typeof error === "string") {
    errObj = makeError("500", error, "");
  } else {
    errObj = makeError("500", "", "");
  }

  const status = typeof errObj.httpCode === "number" ? errObj.httpCode : 500;
  res.status(status);

  const response: Record<string, unknown> = {
    success: false,
    status,
    message: errObj.message,
    key: errObj.key,
    code: errObj.code,
  };

  if (errors) {
    response.errors = errors;
  }

  res.json(response);
};

export default { sendSuccess, sendFailure, makeError };
