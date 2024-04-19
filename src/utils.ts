import { LogLevel } from "./config";
import { Logger } from "./logger";

export function useInterceptor(level: LogLevel) {
  return function (
    _target: Logger,
    _propertyName: string,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => void>
  ) {
    const method = descriptor.value;
    descriptor.value = function (this: Logger, ...args: any[]) {
      this.useInterceptor(level, args);
      return method?.apply(this, args);
    };
  };
}

export function usePlugins() {
  return function (
    _target: Logger,
    propertyName: "info" | "warn" | "log" | "error" | "setLevel" | "setLabel",
    descriptor: TypedPropertyDescriptor<(...args: any[]) => void>
  ) {
    const method = descriptor.value;
    descriptor.value = function (this: Logger, ...args: any[]) {
      this.plugins.forEach((plugin) => {
        plugin[propertyName]?.call(plugin, ...args);
      });
      return method?.apply(this, args);
    };
  };
}

/**
 * @param key key in location-search or process env
 * @returns string-value
 */
export function getEnv(key: string): string {
  return new URLSearchParams(location.search).get(key) ?? "";
}
