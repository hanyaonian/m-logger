# m-web-logger

![Npm Verion](https://badgen.net/npm/v/m-web-logger)
[![Coverage Status](https://coveralls.io/repos/github/hanyaonian/m-logger/badge.svg?branch=main)](https://coveralls.io/github/hanyaonian/m-logger?branch=main)
[![ci](https://github.com/hanyaonian/m-logger/actions/workflows/ci.yml/badge.svg)](https://github.com/hanyaonian/m-logger/actions/workflows/ci.yml)
![TypeScript](https://badgen.net/badge/icon/typescript?icon=typescript&label)

A simple filtering logger util for web development (browser-only).

![screenshot](https://github.com/hanyaonian/m-logger/blob/main/assets/screenshot.png?raw=true)

This is a practice for using decorators(both experimental & typescript 5.0) in TypeScript.

ChatGPT can easily write something better than this, sad story

## install

```sh
npm install m-web-logger
```

## Log types & default setting

m-logger has 5 levels, you can pass it by url query parameter, default is **slient**.

log levels are below:

- `slient`: no log (for production)
- `error`: only error log
- `warn`: includes warning, error
- `info`: includes warning, error, info
- `all`: includes warning, error, info, log

you can also change the level by setting each logger instance, or use label filter.

Priority comparison: global filter > label filter > instance's level > default log level

### Setting

Check browser demo by `npm run dev`.

browser's log level setting is controlled by url query parameter `log_level`.

For example: **{your-web-location}?log_level=${level}**. you can change default level by change `level`

you can also filter log info by url query parameter `label_filter`, this will filter some logs, and only output the logs that contain the filter string in the label.

## Usage

- ### create a logger

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

  logger.log("I can not log");
  filter_logger.log("I can log");
  ```

- ### Use Interceptor

  you can use Interceptor function to get log event.

  ```js
  // interceptor: (config: Config, ...args: any[]) => boolean;
  const logger1 = new Logger({
    label: "interceptor-log",
  });
  const logger2 = new Logger({
    label: "some-module",
  });
  // catch logger event here
  Logger.useInterceptor((info, ...args) => {
    const { config, callLevel } = info;
    const { label } = config;
    if (label === "some-module" && callLevel === LogLevel.error) {
      logger1.warn("Interceptor get [some-module] error event. do something. args:", args);
    }
  });
  logger2.error("some error event;");
  ```

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
