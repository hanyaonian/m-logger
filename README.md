# m-web-logger

A simple log tracer for browser development. It's a practice for decorators(experimental) in TypeScript.

(btw, I found ChatGPT can easily do better than this, T T)

## install

```sh
npm install m-web-logger
```

## log types & default setting

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

## basic usage

A web-logger contains 2 default functions, and other similar custom functions you want:

- Console (log your info into browser's developer console)
- Tracer (saved in browser's indexeddb, todo)
- custom plugins, extends BaseLogger.

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

  you can change `log_level` url params or use `setLevel` method to filter log information.

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
    const { instance, log_level } = config;
    // get 'some-module' error-event
    if (instance.label === "some-module" && log_level === LogLevel.error) {
      logger1.warn("Interceptor get [some-module] error event. do something");
    }
  });
  logger2.error("some error event;");
  ```

## development

```sh
# for browser
npm run dev
```

## build

```sh
npm run build
```
