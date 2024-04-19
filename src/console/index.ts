import { BaseLogger } from "../base";
import { validate, use } from "./decorators";
import { LogLevel, LOG_COLOR, LOG_DESC } from "../config";

export class Console extends BaseLogger {
  public level?: LogLevel;
  public label?: string;

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
    return LOG_COLOR[level];
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

    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/API/console#specifications
     */
    console.log(`%c${prepend}: ${res.join(" ")}`, `color: ${color}`, ...args);
  }
}
