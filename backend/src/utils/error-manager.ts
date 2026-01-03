import _ from "lodash";

import config from "@/config";

interface ErrorConfig {
  CODE: string | number;
  DEFAULT_MESSAGE: string;
  HTTP_CODE: number;
}

type ErrorsMap = Record<string, ErrorConfig>;

const _getErrorByName = (name: string): ErrorConfig => {
  const error = (config.errors as ErrorsMap)[name];
  if (!error) {
    throw new ReferenceError("The error object cant be get for the provided error name");
  }
  return error;
};

const _getErrorByCode = (code: string | number): ErrorConfig => {
  let error: ErrorConfig | undefined;
  _(config.errors as ErrorsMap).forEach((err: ErrorConfig) => {
    if (String(err.CODE) === String(code)) {
      error = err;
    }
  });
  if (!error) {
    throw new ReferenceError("The error object cant be get for the provided error code");
  }
  return error;
};

const getHttpError = (key: string | number, message = ""): AppError => {
  const _key = Number(key);
  let errorConfig: ErrorConfig;
  if (!Number.isNaN(_key)) {
    errorConfig = _getErrorByCode(_key);
  } else {
    errorConfig = _getErrorByName(String(key));
  }
  return new AppError(errorConfig, message, key);
};

class AppError extends Error {
  code: string | number;
  message: string;
  defaultMessage: string;
  httpCode: number;
  key: string | number;
  constructor(error: ErrorConfig, message: string, key: string | number) {
    super(message || error.DEFAULT_MESSAGE);
    this.code = error.CODE;
    this.message = message || error.DEFAULT_MESSAGE;
    this.defaultMessage = error.DEFAULT_MESSAGE;
    this.httpCode = error.HTTP_CODE;
    this.key = key;
  }
}

export default { getHttpError };
