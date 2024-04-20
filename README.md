# m-web-logger

A simple log tracer for browser development. It's a practice for decorators(experimental) in TypeScript.

(btw, I found ChatGPT can easily do better than this, T T)

## Log types & default setting

m-logger has 5 levels, you can pass it by url params, default is **slient**. If the reported info's level is weaker than level you set, it would be ignored.

log level values are below:

- `slient`: no log (for production)
- `error`: only error log
- `warn`: includes warning, error
- `info`: includes warning, error, info
- `all`: includes warning, error, info, log

you can also change the level by setting each logger instance, or use label filter.

Priority comparison: label filter > instance's level > default log level

### Browser setting

you can check browser demo by `npm run dev`.

browser's log level setting is controlled by url query parameter `log_level`.

For example: **{your-web-location}?log_level=${level}**. you can change default level by change `level`

you can also filter log info by `label_filter`

## Usage

Install via npm

```sh
npm install m-web-logger
```

It contains 2 default functions, and other similar custom functions you want:

- Console (log your info into browser's developer console)
- Tracer (saved in browser's indexeddb, todo)
- custom plugins, extends `BaseLogger`.

- ### Create a instance

  ```js
  // for esm
  import { Logger, LogLevel } from "m-web-logger";

  // for umd
  const { MLogger } = window;
  const { Logger, LogLevel } = MLogger;

  // default usage
  const logger = new Logger();
  // with a label or level
  const logger1 = new Logger({
    label: "some-module",
    level: LogLevel.warn,
  });
  ```

- ### Basic

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

- ### Extra Usage

  [ref see](./docs/extra.md)

## Development

```sh
# for browser
npm run dev
```

## Build

```sh
npm run build
```
