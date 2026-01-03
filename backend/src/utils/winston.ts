/* eslint-disable import/no-named-as-default-member */
import chalk from "chalk";
import winston from "winston";

import Config from "@/config";

const consoleFormat = winston.format.printf(({ level, message, timestamp, module, requestId, metadata }) => {
  // const levelColor = levelColors[level as LogLevel] ?? chalk.white;

  const levelIcons: Record<string, string> = {
    error: "❌ ",
    warn: "⚠️ ",
    info: "ℹ️ ",
    debug: "🐛 ",
    verbose: "📜 ",
  };

  const icon = levelIcons[String(level)] || "";

  return [
    chalk.green(timestamp),
    icon,
    requestId ? chalk.magenta(`[${String(requestId as string)}]`) : "NO_REQID",
    chalk.cyan(`[${String(module)}]`),
    String(message),
    Object.keys(metadata ?? {}).length ? chalk.gray(JSON.stringify(metadata)) : "",
  ].join(" ");
});

const winstonLogger = winston.createLogger({
  levels: winston.config.npm.levels,
  level: Config.env.environment === "development" ? "debug" : "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.metadata({ fillExcept: ["message", "level", "timestamp", "module", "requestId"] }),
  ),
  transports: [
    // Console transport → with ANSI colors
    new winston.transports.Console({
      format: consoleFormat,
    }),
  ],
});

export default winstonLogger;
