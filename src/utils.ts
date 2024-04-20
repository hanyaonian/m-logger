import { Logger } from "./logger";
import { BaseLogger } from "./base";
import { LogLevel, LABEL_FILTER, DEFAULT_LEVEL } from "./config";

export function validate(
  _target: BaseLogger,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<(...args: any[]) => void>
) {
  const method = descriptor.value;
  descriptor.value = function (this: BaseLogger, ...args: any[]) {
    if (!args?.length) {
      throw new Error(`Missing required argument in function ${propertyName}.`);
    }
    return method?.apply(this, args);
  };
}

export function filter(level: LogLevel) {
  return function (
    _target: Logger,
    _propertyName: string,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => void>
  ) {
    const method = descriptor.value;
    descriptor.value = function (this: Logger, ...args: any[]) {
      const hasLabelFilter = Boolean(LABEL_FILTER);
      const matchLevel = (this.config.level ?? DEFAULT_LEVEL) <= level;
      const matchLabel = LABEL_FILTER === this.config.label;
      if ((matchLevel && !hasLabelFilter) || (matchLevel && matchLabel)) {
        return method?.apply(this, args);
      }
      return null;
    };
  };
}

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

export function usePlugins(
  _target: Logger,
  propertyName: "info" | "warn" | "log" | "error",
  descriptor: TypedPropertyDescriptor<(...args: any[]) => void>
) {
  const method = descriptor.value;
  descriptor.value = function (this: Logger, ...args: any[]) {
    this.plugins.forEach((plugin) => {
      plugin[propertyName]?.call(plugin, ...args);
    });
    return method?.apply(this, args);
  };
}

/**
 * @param key key in location-search or process env
 * @returns string-value
 */
export function getEnv(key: string): string {
  return new URLSearchParams(location.search).get(key) ?? "";
}
