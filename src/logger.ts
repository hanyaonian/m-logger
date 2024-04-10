import { LogLevel, LOG_COLOR, LOG_DESC, DEFAULT_LEVEL, END_ANSI, NODE_LOG_ANSI } from "./config";
import { validate, use } from "./decorators";
import { env } from "./utils";

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

export class Logger {
  public level?: LogLevel;
  public label?: string;
  public static interceptors: Interceptor[] = [];

  constructor(config?: Config) {
    this.label = config?.label;
    this.level = config?.level ?? DEFAULT_LEVEL;
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

  public setLabel(label?: string) {
    this.label = label;
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

  public getColor(level: LogLevel) {
    return env === "browser" ? LOG_COLOR[level] : NODE_LOG_ANSI[level];
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
    /** @see {link https://console.spec.whatwg.org/#log} */
    const logReplacement: Record<string, string> = {
      string: "%s",
      object: "%o",
      number: "%f",
      function: "%O",
    };
    const color = this.getColor(level);
    const prepend = this.getPrepend(level);
    const res: string[] = [];
    args.forEach((arg) => {
      res.push(logReplacement[typeof arg] ?? "%s");
    });

    if (env === "browser") {
      /**
       * @see https://developer.mozilla.org/en-US/docs/Web/API/console#specifications
       */
      console.log(`%c${prepend}: ${res.join(" ")}`, `color: ${color}`, ...args);
    } else {
      /**
       * @see https://handwiki.org/wiki/ANSI_escape_code
       */
      console.log(`${color}${prepend}: ${res.join(" ")}${END_ANSI}`, ...args);
    }
  }
}
