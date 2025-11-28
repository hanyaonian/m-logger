import { LogEvent } from "./event";

export type LoggerConfig = {
  level?: LogLevel;
  name?: string;
};

export type LoggerOptions = {
  console: IConsole;
  prepend: (evt: LogEvent) => string;
  formatData: (data: unknown[]) => unknown[];
};

export interface IConsole {
  log: (...args: any[]) => void;
  info: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
}

export type LoggerFilter = (config: LoggerConfig, ...args: any[]) => boolean;

export enum LogLevel {
  all,
  info,
  warn,
  error,
  slient,
}

export enum QueryKey {
  level = "log_level",
  filter = "log_name",
}
