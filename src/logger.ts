import { LogLevel } from "./config";
import { Config, BaseLogger, Interceptor } from "./base";
import { usePlugins, useInterceptor, validate, filter } from "./utils";
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

  @validate
  @useInterceptor(LogLevel.warn)
  @filter(LogLevel.warn)
  @usePlugins
  public warn(..._: any[]) {}

  @validate
  @useInterceptor(LogLevel.all)
  @filter(LogLevel.all)
  @usePlugins
  public log(..._: any[]) {}

  @validate
  @useInterceptor(LogLevel.error)
  @filter(LogLevel.error)
  @usePlugins
  public error(..._: any[]) {}

  @validate
  @useInterceptor(LogLevel.info)
  @filter(LogLevel.info)
  @usePlugins
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
