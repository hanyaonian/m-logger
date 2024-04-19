import { LogLevel } from "./config";
import { usePlugins, useInterceptor } from "./utils";
import { Config, BaseLogger, Interceptor } from "./base";
// default plugins
import { Console } from "./console";

export class Logger extends BaseLogger {
  public plugins: BaseLogger[] = [];
  private static interceptors: Interceptor[] = [];

  constructor(config?: Config) {
    super(config);
    this.use(new Console(config));
  }

  public use(plugin: BaseLogger) {
    this.plugins.push(plugin);
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

  @usePlugins()
  public setLevel(_level: LogLevel) {}

  @usePlugins()
  public setLabel(_label?: string) {}

  @usePlugins()
  @useInterceptor(LogLevel.warn)
  public warn(..._: any[]) {}

  @usePlugins()
  @useInterceptor(LogLevel.all)
  public log(..._: any[]) {}

  @usePlugins()
  @useInterceptor(LogLevel.error)
  public error(..._: any[]) {}

  @usePlugins()
  @useInterceptor(LogLevel.info)
  public info(..._: any[]) {}

  public useInterceptor(level: LogLevel, args: any[]) {
    // use Interceptors
    Logger.interceptors?.forEach((func) => {
      func(
        Object.assign({}, this.config, {
          logLevel: level,
        }),
        args
      );
    });
  }
}
