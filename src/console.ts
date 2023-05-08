import { LogLevel, levelColor, levelDesc, DEFAULT_LEVEL } from './config';

export type Config = {
  level?: LogLevel,
  label?: string,
}

type Interceptor = (T: {
  instance: Logger,
  level: LogLevel,
}, ...args: any) => void;

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

  public setLevel(level: LogLevel) {
    this.level = level;
  }

  public setLabel(label?: string) {
    this.label = label;
  }

  public warn(...args: any[]) {
    if (this.match(LogLevel.warn)) {
      this.formatConsole(args, LogLevel.warn);
    }
  }

  public log(...args: any[]) {
    if (this.match(LogLevel.all)) {
      this.formatConsole(args, LogLevel.all);
    }
  }

  public error(...args: any[]) {
    if (this.match(LogLevel.error)) {
      this.formatConsole(args, LogLevel.error);
    }
  }

  public info(...args: any[]) {
    if (this.match(LogLevel.info)) {
      this.formatConsole(args, LogLevel.info);
    }
  }

  private getPrepend(level: LogLevel) {
    return {
      prepend: this.label ? `${levelDesc[level]}-[${this.label}]` : levelDesc[level],
      color: levelColor[level],
    }
  }

  private match(lv: LogLevel): boolean {
    if (this.level) {
      return this.level >= lv;
    }
    return DEFAULT_LEVEL >= lv;
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/console#specifications
   * @param args any[]
   */
  private formatConsole(args: any[], level: LogLevel) {
    const res: string[] = [];
    const strReplacement: Record<string, string> = {
      'string': '%s',
      'object': '%o',
      'number': '%d',
    };

    // use Interceptors
    Logger.interceptors?.forEach(func => {
      func({
        instance: this,
        level: level,
      }, ...args);
    });

    const ext = this.getPrepend(level);
    args.forEach(arg => {
      const type = typeof arg;
      res.push(strReplacement[type] || '%s');
    });
    console.log(`%c${ext.prepend}: ${res.join(' ')}`, `color: ${ext.color}`, ...args);
  }
}