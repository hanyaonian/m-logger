import { BaseLogger } from "../base";
import { LogLevel, LOG_COLOR, LOG_DESC } from "../config";

export class Console extends BaseLogger {
  public warn(...args: any[]) {
    this.toConsole(LogLevel.warn, args);
  }

  public log(...args: any[]) {
    this.toConsole(LogLevel.all, args);
  }

  public error(...args: any[]) {
    this.toConsole(LogLevel.error, args);
  }

  public info(...args: any[]) {
    this.toConsole(LogLevel.info, args);
  }

  public getPrepend(level: LogLevel) {
    return this.config.label ? `[${this.config.label}]-${LOG_DESC[level]}` : LOG_DESC[level];
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
