import { LogLevel, QueryKey } from "./enum";
import { getUrlQuery } from "./utils";
import { LogEvent } from "./event";

import type { LoggerConfig } from "./types";

export function getDefaultLogLevelSetting() {
  return LogLevel[getUrlQuery(QueryKey.level) as keyof typeof LogLevel] ?? LogLevel.slient;
}

export function getDefaultLogFilter() {
  return (config: LoggerConfig) => {
    const urlQuerySetting = getUrlQuery(QueryKey.filter);
    return (config.name ?? "").includes(urlQuerySetting);
  };
}

export function getDefaultPrepend() {
  return (evt: LogEvent) => {
    const desc: Record<LogLevel, string> = {
      [LogLevel.slient]: "",
      [LogLevel.error]: "ERROR",
      [LogLevel.warn]: "WARN",
      [LogLevel.info]: "INFO",
      [LogLevel.all]: "LOG",
    };
    const time = evt.logTime.toLocaleString();
    const level = evt.logLevel;
    return `[${time}] [${desc[level]}] ${evt.logName ? `[${evt.logName}]` : ""}`;
  };
}

export function getDefaultDataFormatter() {
  return (evt: LogEvent) => {
    return evt.logData;
  };
}
