# Decorator

use `Decorators` in TypeScript 5.0 to replace `reflect-metadata`

- tc39 [proposal link](https://github.com/tc39/proposal-decorators)

- new [TypeScript 5.0](https://devblogs.microsoft.com/typescript/announcing-typescript-5-0/#decorators)
- old [Experimental Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html)

## Genaral Type 5.0

```ts
// @see lib.decorators.d
type ClassMemberDecoratorContext =
  | ClassMethodDecoratorContext
  | ClassGetterDecoratorContext
  | ClassSetterDecoratorContext
  | ClassFieldDecoratorContext
  | ClassAccessorDecoratorContext;

type DecoratorContext = ClassDecoratorContext | ClassMemberDecoratorContext;
```

All decorators become like:

```ts
type XXDecoratorContext = (
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
