import { LogLevel } from "./enum";
import { Logger } from "./logger";

/**
 * @note
 *
 * before TypeScript5.0, with experimentalDecorators: true
 *
 * - old: https://www.typescriptlang.org/docs/handbook/decorators.html
 * - new: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html#decorators
 *
 * It wasn't supported by rollup & esbuild before https://github.com/rollup/rollup/pull/5562 & https://github.com/evanw/esbuild/pull/3754
 *
 * - https://github.com/evanw/esbuild/blob/HEAD/CHANGELOG.md#0213
 * -
 *
 * Former code of experimentalDecorators implement:
 *
 * ```ts
 * export function validate(
 *   _target: Logger,
 *   propertyName: string,
 *   descriptor: TypedPropertyDescriptor<(...args: any[]) => void>
 * ) {
 *   const method = descriptor.value;
 *   descriptor.value = function (this: Logger, ...args: any[]) {
 *     if (!args.length) {
 *       console.error(`Missing required argument in ${propertyName}.`);
 *     }
 *     return method?.apply(this, args);
 *   };
 * }
 *
 * export function filter(level: LogLevel) {
 *   return function (
 *     _target: Logger,
 *     _propertyName: string,
 *     descriptor: TypedPropertyDescriptor<(...args: any[]) => void>
 *   ) {
 *     const method = descriptor.value;
 *     descriptor.value = function (this: Logger, ...args: any[]) {
 *       const hasLabelFilter = Boolean(Logger.filter);
 *       const matchLevel = this.level <= level;
 *       const matchLabel = Logger.filter(this.config ?? {}, ...args);
 *       if ((matchLevel && !hasLabelFilter) || (matchLevel && matchLabel)) {
 *         this.callHook(level, args);
 *         return method?.apply(this, args);
 *       }
 *       return null;
 *     };
 *   };
 * }
 *
 * ```
 */

/**
 * get method types of Class;
 */

type MethodsOfClass<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? T[K] : never;
}[keyof T];

export function filter(level: LogLevel) {
  return function (method: MethodsOfClass<Logger>, _context: ClassMethodDecoratorContext) {
    function replacement(this: Logger, ...args: any[]) {
      const hasFilter = Boolean(Logger.filter);
      const matchLevel = this.level <= level;
      const matchLabel = Logger.filter(this.config, ...args);
      if ((matchLevel && !hasFilter) || (matchLevel && matchLabel)) {
        return method?.apply(this, args);
      }
      return null;
    }
    return replacement;
  };
}
