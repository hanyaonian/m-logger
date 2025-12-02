import { LogEvent } from "./event";
import { LogLevel } from "./enum";

export type LoggerConfig = {
  level?: LogLevel;
  name?: string;
};

export type LoggerOptions = {
  console: IConsole;
  prepend: (evt: LogEvent) => string;
  formatData: (evt: LogEvent) => unknown[];
};

export interface IConsole {
  log: (...args: any[]) => void;
  info: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
}

export type LoggerFilter = (config: LoggerConfig, ...args: any[]) => boolean;
