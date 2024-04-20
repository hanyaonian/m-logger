# Extra Usage

- ## setting a label for bug trace

  you can define a label for more-specific log information.

  ```js
  logger.setLabel("define-label");
  logger.log(obj);
  logger.info(1, obj);
  logger.warn(1, 2, obj);
  logger.error(1, 2, 3, obj);
  ```

- ## setting level for filter

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

- ## Use Interceptor

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

- ## Console or Tracer only

```ts
import { Console, Tracer } from "m-web-logger";
```
