import { DEFAULT_LEVEL, LABEL_FILTER, LogLevel } from "./config";
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
  const method = descriptor.value;
  descriptor.value = function (this: Logger, ...args: any[]) {
    if (!args?.length) {
      throw new Error(`Missing required argument in function ${propertyName}.`);
    }
    return method?.apply(this, args);
  };
}

export function use(level: LogLevel) {
  return function (
    _target: Logger,
    _propertyName: string,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => void>
  ) {
    const method = descriptor.value;
    descriptor.value = function (this: Logger, ...args: any[]) {
      const hasLabelFilter = Boolean(LABEL_FILTER);
      const matchLevel = (this.level ?? DEFAULT_LEVEL) <= level;
      const matchLabel = LABEL_FILTER === this.label;
      if ((matchLevel && !hasLabelFilter) || (matchLevel && matchLabel)) {
        this.toConsole(level, args);
        this.useInterceptor(level, args);
        return method?.apply(this, args);
      }
      return null;
    };
  };
}
