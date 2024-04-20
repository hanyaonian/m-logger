import { getEnv } from "./utils";

export enum LogFilterKey {
  level = "log_level",
  label = "label_filter",
}

export enum LogLevel {
  all,
  info,
  warn,
  error,
  slient,
}

export const END_ANSI = "\x1B[0m";

export const NODE_LOG_ANSI: Record<LogLevel, string> = {
  [LogLevel.slient]: "",
  [LogLevel.error]: "\x1B[31m",
  [LogLevel.warn]: "\x1B[33m",
  [LogLevel.info]: "\x1B[34m",
  [LogLevel.all]: "\x1B[32m",
};

export const LOG_COLOR: Record<LogLevel, string> = {
  [LogLevel.slient]: "",
  [LogLevel.error]: "red",
  [LogLevel.warn]: "orange",
  [LogLevel.info]: "skyblue",
  [LogLevel.all]: "gray",
};

export const LOG_DESC: Record<LogLevel, string> = {
  [LogLevel.slient]: "",
  [LogLevel.error]: "[error]",
  [LogLevel.warn]: "[warn]",
  [LogLevel.info]: "[info]",
  [LogLevel.all]: "[log]",
};

// @ts-expect-error if not matched, default is slient
export const DEFAULT_LEVEL: LogLevel = LogLevel[getEnv(LogFilterKey.level)] ?? LogLevel.slient;
export const LABEL_FILTER = getEnv(LogFilterKey.label);
