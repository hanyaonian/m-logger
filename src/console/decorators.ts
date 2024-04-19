import { DEFAULT_LEVEL, LABEL_FILTER, LogLevel } from "../config";
import { Console } from "./index";

/**
 * https://www.typescriptlang.org/docs/handbook/decorators.html
 */

export function validate(
  _target: Console,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<(...args: any[]) => void>
) {
  const method = descriptor.value;
  descriptor.value = function (this: Console, ...args: any[]) {
    if (!args?.length) {
      throw new Error(`Missing required argument in function ${propertyName}.`);
    }
    return method?.apply(this, args);
  };
}

export function use(level: LogLevel) {
  return function (
    _target: Console,
    _propertyName: string,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => void>
  ) {
    const method = descriptor.value;
    descriptor.value = function (this: Console, ...args: any[]) {
      const hasLabelFilter = Boolean(LABEL_FILTER);
      const matchLevel = (this.level ?? DEFAULT_LEVEL) <= level;
      const matchLabel = LABEL_FILTER === this.label;
      if ((matchLevel && !hasLabelFilter) || (matchLevel && matchLabel)) {
        this.toConsole(level, args);
        return method?.apply(this, args);
      }
      return null;
    };
  };
}
