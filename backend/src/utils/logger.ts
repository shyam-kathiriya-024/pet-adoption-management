import type { UR } from "@/types";
import { LogLevel } from "@/types";

import winstonLogger from "./winston";

class Logger {
  private module: string;
  static instanceMap = new Map<string, Logger>();

  static getInstance(module: string): Logger {
    if (!this.instanceMap.has(module)) {
      this.instanceMap.set(module, new Logger(module));
    }
    return this.instanceMap.get(module)!;
  }

  constructor(module: string) {
    this.module = module;
  }

  private logToWinston(level: LogLevel, message: string, metadata?: UR) {
    winstonLogger.log({
      level: level.toLowerCase(),
      message,
      module: this.module,
      ...metadata,
    });
  }

  log(message: string, metadata?: UR): void {
    this.logToWinston(LogLevel.LOG, message, metadata);
  }

  warn(message: string, metadata?: UR): void {
    this.logToWinston(LogLevel.WARN, message, metadata);
  }

  error(message: string, metadata?: UR): void {
    this.logToWinston(LogLevel.ERROR, message, metadata);
  }

  info(message: string, metadata?: UR): void {
    this.logToWinston(LogLevel.INFO, message, metadata);
  }

  debug(message: string, metadata?: UR): void {
    this.logToWinston(LogLevel.DEBUG, message, metadata);
  }
}

export default Logger;
