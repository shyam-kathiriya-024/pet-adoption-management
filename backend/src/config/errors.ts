import type { IErrorConfig } from "@/types";

const errors: Record<string, IErrorConfig> = {
  EMAIL_ALREADY_EXIST: {
    CODE: 1,
    DEFAULT_MESSAGE: "Email already exists.",
    HTTP_CODE: 400,
  },
  DATA_NOT_FOUND: {
    CODE: 2,
    DEFAULT_MESSAGE: "Data is not found",
    HTTP_CODE: 404,
  },
  INVALID_CREDENTIALS: {
    CODE: 3,
    DEFAULT_MESSAGE: "Invalid email or password",
    HTTP_CODE: 401,
  },
  UNAUTHORIZED: {
    CODE: 4,
    DEFAULT_MESSAGE: "Unauthorized access",
    HTTP_CODE: 401,
  },
  FORBIDDEN: {
    CODE: 5,
    DEFAULT_MESSAGE: "Access forbidden",
    HTTP_CODE: 403,
  },
  TOKEN_EXPIRED: {
    CODE: 6,
    DEFAULT_MESSAGE: "Token has expired",
    HTTP_CODE: 401,
  },
  INVALID_TOKEN: {
    CODE: 7,
    DEFAULT_MESSAGE: "Invalid token",
    HTTP_CODE: 401,
  },
  PET_NOT_FOUND: {
    CODE: 8,
    DEFAULT_MESSAGE: "Pet not found",
    HTTP_CODE: 404,
  },
  PET_NOT_AVAILABLE: {
    CODE: 9,
    DEFAULT_MESSAGE: "Pet is not available for adoption",
    HTTP_CODE: 400,
  },
  DUPLICATE_APPLICATION: {
    CODE: 10,
    DEFAULT_MESSAGE: "You already have an active application for this pet",
    HTTP_CODE: 400,
  },
  APPLICATION_NOT_FOUND: {
    CODE: 11,
    DEFAULT_MESSAGE: "Application not found",
    HTTP_CODE: 404,
  },
  USER_NOT_FOUND: {
    CODE: 12,
    DEFAULT_MESSAGE: "User not found",
    HTTP_CODE: 404,
  },
  VALIDATION_ERROR: {
    CODE: 13,
    DEFAULT_MESSAGE: "Validation error",
    HTTP_CODE: 400,
  },
};

export default errors;
