import { LogLevel, LOG_COLOR, LOG_DESC, GET_DEFAULT_LEVEL, GET_DEFAULT_FILTER } from "./config";
import { validate, filter } from "./decorators";
import { getSpecifier } from "./utils";
import type { Config, Interceptor, FilterFunc } from "./config";

export class Logger {
  public static interceptors: Interceptor[] = [];
  public static filter: FilterFunc = GET_DEFAULT_FILTER();

  public level: LogLevel = GET_DEFAULT_LEVEL();
  public get label() {
    return this.config?.label;
  }

  constructor(readonly config: Config = {}) {
    this.level = Object.values(LogLevel).includes(this.config.level!)
      ? this.config.level!
      : GET_DEFAULT_LEVEL();
  }

  public static useInterceptor(func: Interceptor) {
    Logger.interceptors.push(func);
  }

  public static removeInterceptor(func: Interceptor) {
    const index = Logger.interceptors.findIndex((f) => f === func);
    if (index >= 0) {
      Logger.interceptors.splice(index, 1);
    }
  }

  public setLevel(level: LogLevel) {
    this.level = level;
  }

  public setLabel(label: string) {
    this.config.label = label;
  }

  @validate
  @filter(LogLevel.warn)
  public warn(...args: any[]) {
    return this.print(LogLevel.warn, args);
  }

  @validate
  @filter(LogLevel.all)
  public log(...args: any[]) {
    return this.print(LogLevel.all, args);
  }

  @validate
  @filter(LogLevel.error)
  public error(...args: any[]) {
    return this.print(LogLevel.error, args);
  }

  @validate
  @filter(LogLevel.info)
  public info(...args: any[]) {
    return this.print(LogLevel.info, args);
  }

  public callHook(level: LogLevel, args: any[]) {
    // use Interceptors
    Logger.interceptors?.forEach((func) => {
      func(
        {
          callLevel: level,
          config: this.config,
        },
        args
      );
    });
  }

  private print(level: LogLevel, args: any[]) {
    const prepend = this.label ? `[${this.label}]-${LOG_DESC[level]}` : LOG_DESC[level];
    const color = LOG_COLOR[level];
    const res: string[] = [];
    args.forEach((arg) => {
      res.push(getSpecifier(arg));
    });

    // https://developer.mozilla.org/en-US/docs/Web/API/console#specifications
    return console.log(`%c${prepend}: ${res.join(" ")}`, `color: ${color}`, ...args);
  }
}
