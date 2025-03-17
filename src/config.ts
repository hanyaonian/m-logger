import { getUrlQuery } from "./utils";

export type Config = {
  level?: LogLevel;
  label?: string;
};

export type Interceptor = (
  info: {
    config: Config;
    callLevel: LogLevel;
  },
  args: any[]
) => void;

export type FilterFunc = (config: Config, ...args: any[]) => boolean;

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

export const GET_DEFAULT_LEVEL = () =>
  LogLevel[getUrlQuery(QueryKey.level) as keyof typeof LogLevel] ?? LogLevel.slient;

export const GET_DEFAULT_FILTER = () => {
  return (config: Config) => {
    const urlQuerySetting = getUrlQuery(QueryKey.filter);
    return (config.label ?? "").includes(urlQuerySetting);
  };
};
