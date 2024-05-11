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

  private getColor(level: LogLevel) {
    return LOG_COLOR[level];
  }

  /**
   * @see {link https://console.spec.whatwg.org/#log}
   * @see {link https://developer.mozilla.org/en-US/docs/Web/API/console#specifications}
   */
  private toConsole(level: LogLevel, args: any[]) {
    const logReplacement: Record<string, string> = {
      string: "%s",
      object: "%o",
      number: "%f",
      function: "%O",
    };
    const info: string = args.map((arg) => logReplacement[typeof arg] ?? "%s").join(" ");
    console.log(`%c${this.getPrepend(level)}: ${info}`, `color: ${this.getColor(level)}`, ...args);
  }
}
