import { LogLevel, QueryKey, LoggerConfig } from "./types";
import { getUrlQuery } from "./utils";
import { LogEvent } from "./event";

export const getDefaultLogLevelSetting = () => {
  return LogLevel[getUrlQuery(QueryKey.level) as keyof typeof LogLevel] ?? LogLevel.slient;
};

export const getDefaultLogFilter = () => {
  return (config: LoggerConfig) => {
    const urlQuerySetting = getUrlQuery(QueryKey.filter);
    return (config.name ?? "").includes(urlQuerySetting);
  };
};

export const getDefaultPrepend = (() => {
  const desc: Record<LogLevel, string> = {
    [LogLevel.slient]: "",
    [LogLevel.error]: "ERROR",
    [LogLevel.warn]: "WARN",
    [LogLevel.info]: "INFO",
    [LogLevel.all]: "LOG",
  };
  return (evt: LogEvent) => {
    const time = evt.logTime.toLocaleString();
    const level = evt.logLevel;
    return `[${time}] [${desc[level]}] ${evt.logName ? `[${evt.logName}]` : ""}`;
  };
})();

export function getDefaultDataFormatter(data: unknown[]) {
  return data;
}
