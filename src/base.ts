import { LogLevel, DEFAULT_LEVEL } from "./config";
import { validate } from "./utils";

/**
 * all plugins should fulfill these properties and methods
 */
export abstract class BaseLogger {
  constructor(public readonly config: Config = { label: "", level: DEFAULT_LEVEL }) {}

  @validate
  public setLevel(level: LogLevel): void {
    this.config.level = level;
  }
  @validate
  public setLabel(label: string): void {
    this.config.label = label;
  }

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
