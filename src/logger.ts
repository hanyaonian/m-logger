import { LogLevel } from "./types";
import { LogEvent } from "./event";
import { filter } from "./decorators";
import {
  getDefaultLogLevelSetting,
  getDefaultLogFilter,
  getDefaultPrepend,
  getDefaultDataFormatter,
} from "./config";

import type { LoggerConfig, LoggerFilter, LoggerOptions } from "./types";

/**
 * A demo project for learning decorator syntax and unit testing
 */
export class Logger {
  public static filter: LoggerFilter = getDefaultLogFilter();

  public level: LogLevel;
  public get name() {
    return this.config?.name;
  }

  constructor(
    readonly config: LoggerConfig = {},
    readonly options: LoggerOptions = {
      console: console,
      prepend: getDefaultPrepend,
      formatData: getDefaultDataFormatter,
    }
  ) {
    this.level = Object.values(LogLevel).includes(this.config.level!)
      ? this.config.level!
      : getDefaultLogLevelSetting();
  }

  /**
   * change the trace level of an instance
   */
  public setLevel(level: LogLevel) {
    this.level = level;
  }

  /**
   * change the name of an instance
   */
  public setName(name: string) {
    this.config.name = name;
  }

  @filter(LogLevel.warn)
  public warn(...args: any[]) {
    return this.print(new LogEvent(LogLevel.warn, this.name, args));
  }

  @filter(LogLevel.all)
  public log(...args: any[]) {
    return this.print(new LogEvent(LogLevel.all, this.name, args));
  }

  @filter(LogLevel.error)
  public error(...args: any[]) {
    return this.print(new LogEvent(LogLevel.error, this.name, args));
  }

  @filter(LogLevel.info)
  public info(...args: any[]) {
    return this.print(new LogEvent(LogLevel.info, this.name, args));
  }

  @filter(LogLevel.all)
  public trace(...args: any[]) {
    const stack = this.createStack();
    return this.print(new LogEvent(LogLevel.all, this.name, [stack].concat(args)));
  }

  private createStack(): string {
    const stack: string = (new Error().stack ?? "").replace("Error\n", "");
    const array: string[] = stack.split("\n");
    array.splice(0, 3);
    return array.join("\n");
  }

  /**
   * https://developer.mozilla.org/en-US/docs/Web/API/console#specifications
   */
  private print(event: LogEvent) {
    const { logLevel: level, logData: data } = event;

    const prepend = this.options.prepend(event);

    if (level === LogLevel.warn) {
      return console.warn(`${prepend} `, ...this.options.formatData(data));
    } else if (level === LogLevel.error) {
      return console.error(`${prepend} `, ...this.options.formatData(data));
    } else if (level === LogLevel.info) {
      return console.info(`${prepend} `, ...this.options.formatData(data));
    } else {
      return console.log(`${prepend} `, ...this.options.formatData(data));
    }
  }
}
