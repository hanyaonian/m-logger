import { getArg } from "./utils";

export type Config = {
  level?: LogLevel;
  label?: string;
};

export enum LogLevel {
  all,
  info,
  warn,
  error,
  slient,
}

export enum QueryKey {
  level = "log_level",
  filter = "label_filter",
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

export const DEFAULT_LEVEL =
  LogLevel[getArg(QueryKey.level) as keyof typeof LogLevel] ?? LogLevel.slient;

export const DEFAULT_FILTER = (() => {
  const urlQuerySetting = getArg(QueryKey.filter);
  return (config: Config) => {
    return (config.label ?? "").includes(urlQuerySetting);
  };
})();
