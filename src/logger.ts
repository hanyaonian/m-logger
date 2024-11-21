import { LogLevel, LOG_COLOR, LOG_DESC, DEFAULT_LEVEL, DEFAULT_FILTER } from "./config";
import { validate, use } from "./decorators";
import { getSpecifier } from "./utils";

export type Config = {
  level?: LogLevel;
  label?: string;
};

type Interceptor = (
  T: {
    instance: Logger;
    level: LogLevel;
  },
  args: any[]
) => void;

type FilterFunc = string | ((config: Config, ...args: any[]) => boolean);

export class Logger {
  public static interceptors: Interceptor[] = [];
  public static filter: FilterFunc = DEFAULT_FILTER;

  public get level() {
    return this.config?.level ?? DEFAULT_LEVEL;
  }

  public get label() {
    return this.config?.label;
  }

  constructor(readonly config: Config = {}) {}

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
    this.config.level = level;
  }

  public setLabel(label: string) {
    this.config.label = label;
  }

  @validate
  @use(LogLevel.warn)
  public warn(..._: any[]) {}

  @validate
  @use(LogLevel.all)
  public log(..._: any[]) {}

  @validate
  @use(LogLevel.error)
  public error(..._: any[]) {}

  @validate
  @use(LogLevel.info)
  public info(..._: any[]) {}

  public getPrepend(level: LogLevel) {
    return this.label ? `[${this.label}]-${LOG_DESC[level]}` : LOG_DESC[level];
  }

  public useInterceptor(level: LogLevel, args: any[]) {
    // use Interceptors
    Logger.interceptors?.forEach((func) => {
      func(
        {
          instance: this,
          level: level,
        },
        args
      );
    });
  }

  public toConsole(level: LogLevel, args: any[]) {
    const color = LOG_COLOR[level];
    const prepend = this.getPrepend(level);
    const res: string[] = [];
    args.forEach((arg) => {
      res.push(getSpecifier(arg));
    });

    // https://developer.mozilla.org/en-US/docs/Web/API/console#specifications
    console.log(`%c${prepend}: ${res.join(" ")}`, `color: ${color}`, ...args);
  }
}
