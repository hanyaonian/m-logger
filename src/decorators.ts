import { DEFAULT_LEVEL, LogLevel } from "./config";
import { Logger } from "./logger";

/**
 * @description
 * before TypeScript5.0
 *
 * https://www.typescriptlang.org/docs/handbook/decorators.html
 */

export function validate(
  target: Logger,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<(...args: any[]) => void>
) {
  let method = descriptor.value;
  descriptor.value = function (this: Logger, ...args: any[]) {
    if (!args?.length) {
      throw new Error(`Missing required argument in function ${propertyName}.`);
    }
    return method?.apply(this, args);
  };
}

export function use(method_level: LogLevel) {
  return function (
    _target: Logger,
    _propertyName: string,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => void>
  ) {
    let method = descriptor.value;
    descriptor.value = function (this: Logger, ...args: any[]) {
      const cur_level = this.level ?? DEFAULT_LEVEL;
      if (cur_level <= method_level) {
        this.toConsole(method_level, Array.from(arguments));
        this.useInterceptor(method_level, Array.from(arguments));
        return method?.apply(this, args);
      }
      return null;
    };
  };
}
