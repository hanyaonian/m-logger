import { getQuery } from "./utils";

export enum LogLevel {
  all,
  info,
  warn,
  error,
  slient,
}

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

export const DEFAULT_LEVEL = LogLevel[getQuery("log") as keyof typeof LogLevel] || LogLevel.all;
