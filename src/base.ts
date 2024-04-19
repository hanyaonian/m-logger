import { LogLevel, DEFAULT_LEVEL } from "./config";

/**
 * all plugins should fulfill these properties and methods
 */
export abstract class BaseLogger {
  constructor(public readonly config: Config = { label: "", level: DEFAULT_LEVEL }) {}

  public abstract setLevel(level: LogLevel): void;
  public abstract setLabel(label: string): void;

  public abstract warn(..._: any[]): void;
  public abstract log(..._: any[]): void;
  public abstract error(..._: any[]): void;
  public abstract info(..._: any[]): void;
}

export type Interceptor = (T: Config & { logLevel: LogLevel }, args: any[]) => void;

export type Config = {
  level?: LogLevel;
  label?: string;
};
