import { LogLevel, LOG_COLOR, LOG_DESC, DEFAULT_LEVEL, DEFAULT_FILTER, Config } from "./config";
import { validate, use } from "./decorators";
import { getSpecifier } from "./utils";

type Interceptor = (config: Config, args: any[]) => void;
type FilterFunc = (config: Config, ...args: any[]) => boolean;

export class Logger {
  public static interceptors: Interceptor[] = [];
  public static filter: FilterFunc = DEFAULT_FILTER;

  public level: LogLevel = Object.values(LogLevel).includes(this.config.level!)
    ? this.config.level!
    : DEFAULT_LEVEL;

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

  public useInterceptor(args: any[]) {
    // use Interceptors
    Logger.interceptors?.forEach((func) => {
      func(this.config, args);
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
