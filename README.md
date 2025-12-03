# m-web-logger

![Npm Version](https://badgen.net/npm/v/m-web-logger)
[![Coverage Status](https://coveralls.io/repos/github/hanyaonian/m-logger/badge.svg?branch=main)](https://coveralls.io/github/hanyaonian/m-logger?branch=main)
[![ci](https://github.com/hanyaonian/m-logger/actions/workflows/ci.yml/badge.svg)](https://github.com/hanyaonian/m-logger/actions/workflows/ci.yml)
![TypeScript](https://badgen.net/badge/icon/typescript?icon=typescript&label)

A simple filtering logger util for web development (browser-only).

Practice of TypeScript 5.0 decorators.

## Install

```sh
npm install m-web-logger
```

## Log types & default setting

m-logger has 5 levels, you can pass it by URL query parameter, default is **silent**.

log levels are below:

- `silent`: no log (for production)
- `error`: only error log
- `warn`: includes warning, error
- `info`: includes warning, error, info
- `all`: includes warning, error, info, log

You can also change the level by setting each logger instance, or use label filter.

Priority comparison: global filter > label filter > instance's level > default log level

### Setting

Check browser demo by `npm run dev`.

browser's log level setting is controlled by URL query parameter `log_level`.

For example: **{your-web-location}?log_level=${level}**. You can change the default level by changing the `level` parameter.

You can also filter log info by URL query parameter `log_name`, this will filter some logs, and only output the logs that contain the filter string in the label.

## Usage

- ### Create a logger

  ```js
  // es module
  import { Logger, LogLevel } from "m-web-logger";

  // umd from browser window
  // const { MLogger } = window;
  // const { Logger, LogLevel } = MLogger;

  // default usage
  const logger = new Logger();

  // or pass label or level to it
  const logger1 = new Logger({
    label: "some-module",
    level: LogLevel.warn,
  });
  ```

- ### Basic use

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

- ### Setting level for filter

  You can change `log` URL params or use `setLevel` method to filter log information.

  ```js
  // change the url params log to `error`
  // or use setLevel
  logger.setLevel(LogLevel.error);
  logger.log(obj); // filtered
  logger.info(1, obj); // filtered
  logger.warn(1, 2, obj); // filtered
  logger.error("after set-level, you can only see error log");
  ```

- ### Global Filter

  ```js
  /**
   * global filter.
   * filter: (config: Config, ...args: any[]) => boolean;
   */
  const logger = new Logger();
  const filter_logger = new Logger({
    label: "global-filter-log",
  });

  Logger.filter = (config, ...args) => {
    if (config.label === "global-filter-log") {
      return true;
    }
    return false;
  };

  logger.log("I cannot log");
  filter_logger.log("I can log");

  // restore
  Logger.filter = undefined;
  ```

- ### Custom Options

  You can customize logger behavior by passing `LoggerOptions` as the second parameter. This allows you to integrate with other logging services (like Sentry, LogRocket, etc.) or customize log formatting.

  ```js
  // Example: Integrate with Sentry
  import * as Sentry from "@sentry/browser";

  const customConsole = {
    log: (...args) => {
      console.log(...args);
      Sentry.addBreadcrumb({ message: args.join(" "), level: "info" });
    },
    info: (...args) => {
      console.info(...args);
      Sentry.addBreadcrumb({ message: args.join(" "), level: "info" });
    },
    warn: (...args) => {
      console.warn(...args);
      Sentry.addBreadcrumb({ message: args.join(" "), level: "warning" });
    },
    error: (...args) => {
      console.error(...args);
      Sentry.captureException(new Error(args.join(" ")));
    },
  };

  const logger = new Logger(
    { name: "my-module", level: LogLevel.all },
    {
      console: customConsole,
      prepend: (evt) => {
        // Custom prepend format
        return `[${evt.logName || "default"}]`;
      },
      formatData: (evt) => {
        // Custom data formatting
        return evt.data.map((item) => {
          if (typeof item === "object") {
            return JSON.stringify(item);
          }
          return item;
        });
      },
    }
  );
  ```

  **Options:**

  - `console`: An object implementing `IConsole` interface with `log`, `info`, `warn`, `error` methods. Use this to integrate with other logging services.
  - `prepend`: A function that receives `LogEvent` and returns a string to prepend to each log message.
  - `formatData`: A function that receives receives `LogEvent` and returns a formatted array (logging info).

## Development

require `pnpm`.

```sh
# npm i pnpm -g
pnpm i

# open browser for test
pnpm dev

# test case
pnpm test
```

## Build

```sh
pnpm build
```
