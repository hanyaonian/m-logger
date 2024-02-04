# Decorator

use `Decorators` in TypeScript 5.0 to replace `reflect-metadata`

[proposal link](https://github.com/tc39/proposal-decorators)
[ts 5.0 link](https://devblogs.microsoft.com/typescript/announcing-typescript-5-0/#decorators)

## Types

Genaral Type

```ts
export type Decorator = (
  value: any,
  context: {
    kind: "class" | "getter" | "method" | "setter" | "field" | "accessor";
    name: string | symbol;
    access: {
      get?(): unknown;
      set?(value: unknown): void;
    };
    private?: boolean;
    static?: boolean;
    addInitializer?(initializer: () => void): void;
  }
) => any | void;
```

## Issues

- while using tsx: [esbuild Error]: Transforming JavaScript decorators to the configured target environment ("node18.19.0") is not supported yet

## End
