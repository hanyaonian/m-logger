# m-web-logger

A simple logger util for web development. (btw, I found ChatGPT can easily do better than this, T T)

> **Note** :speech_balloon:
> Version from 0.2.0 use `decorators`, which increases package size but **No change** in functionality

## install

```sh
npm install m-web-logger
```

## basic usage

you can check demo page via `npm run dev`.

m-logger has 5 level, you can pass it via url params, default is **`slient`**.

For example: **`{your-web-location}?log=${level}`**.

log level values are below:

- `slient`: no log (for production)
- `error`: only error log
- `warn`: includes warning, error
- `info`: includes warning, error, info
- `all`: includes warning, error, info, log

- ### create a logger

  ```js
  // es module
  import { Logger, LogLevel } from "m-web-logger";

  // umd from browser window
  const { MLogger } = window;
  const { Logger, LogLevel } = MLogger;

  // default usage
  const logger = new Logger();
  // or pass label or level to it
  const logger1 = new Logger({
    label: "some-module",
    level: LogLevel.warn,
  });
  ```

- ### basic use

  ```js
  logger.log(1);
  logger.info(1, 2);
  logger.warn(1, 2, 3);
  logger.error(1, 2, 3, 4);

  const obj = { a: "hello world" };
  logger.log(obj);
  logger.info(1, obj);
  logger.warn(1, 2, obj);
  logger.error(1, 2, 3, obj);
  ```

- ### setting a label for bug trace

  you can define a label for more-specific log information.

  ```js
  logger.setLabel("define-label");
  logger.log(obj);
  logger.info(1, obj);
  logger.warn(1, 2, obj);
  logger.error(1, 2, 3, obj);
  ```

- ### setting level for filter

  you can change `log` url params or use `setLevel` method to filter log information.

  ```js
  // change the url params log to `error`
  // or use setLevel
  logger.setLevel(LogLevel.error);
  logger.log(obj); // filtered
  logger.info(1, obj); // filtered
  logger.warn(1, 2, obj); // filtered
  logger.error("after set-lelve, you can only see error log");
  ```

- ### Use Interceptor

  you can use Interceptor function to get log event.

  ```js
  const logger1 = new Logger({
    label: "interceptor-log",
  });
  const logger2 = new Logger({
    label: "some-module",
  });
  // catch logger event here
  Logger.useInterceptor((config, ...args) => {
    const { instance, level } = config;
    // get 'some-module' error-event
    if (instance.label === "some-module" && level === LogLevel.error) {
      logger1.warn("Interceptor get [some-module] error event. do something");
    }
  });
  logger2.error("some error event;");
  ```

## development

```sh
npm run dev
```

## build

```sh
npm run build
```
