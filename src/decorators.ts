import { DEFAULT_LEVEL, LogLevel } from "./config";
import { Logger } from "./console";
import "reflect-metadata";

const requiredMetadataKey = Symbol("required");

export function required(target: Object, propertyKey: string | symbol, parameterIndex: number) {
  let existingRequiredParameters: number[] =
    Reflect.getOwnMetadata(requiredMetadataKey, target, propertyKey) || [];
  existingRequiredParameters.push(parameterIndex);
  Reflect.defineMetadata(requiredMetadataKey, existingRequiredParameters, target, propertyKey);
}

export function validate(
  target: any,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<(...args: any[]) => void>
) {
  let method = descriptor.value;
  descriptor.value = function (...args: any[]) {
    let requiredParameters: number[] = Reflect.getOwnMetadata(
      requiredMetadataKey,
      target,
      propertyName
    );
    if (requiredParameters) {
      for (let parameterIndex of requiredParameters) {
        if (parameterIndex >= arguments.length || arguments[parameterIndex] === undefined) {
          throw new Error(`Missing required argument in function ${propertyName}.`);
        }
      }
    }

    return method?.apply(this, args);
  };
}

export function match(level: LogLevel) {
  return function (
    _target: Logger,
    _propertyName: string,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => void>
  ) {
    let method = descriptor.value;
    descriptor.value = function (...args: any[]) {
      // FIXME: this type
      // @ts-ignore
      const target_level = this.level || DEFAULT_LEVEL;
      if (target_level <= level) {
        return method?.apply(this, args);
      }
      return () => {};
    };
  };
}
