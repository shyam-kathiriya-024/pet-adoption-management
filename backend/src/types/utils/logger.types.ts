import type { UR } from "../common";

export enum LogLevel {
  ERROR = "error",
  WARN = "warn",
  INFO = "info",
  DEBUG = "debug",
  LOG = "log",
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  module: string;
  timestamp: string;
  metadata?: UR;
}
