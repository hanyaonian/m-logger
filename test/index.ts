import { Logger, LogLevel } from "../src/index";

const logger = new Logger();
const labelLogger = new Logger({ label: "test" });

// basic usage
logger.info(() => {});
logger.log(1.1);
logger.info(1, 2);
logger.warn(1, 2, 3);
logger.error(1, 2, 3, 4);

// object log
const obj = { a: "hello world" };
try {
  logger.warn();
} catch (err) {
  logger.warn("got an error captured by decorator: \n", err);
}
logger.log(obj);
logger.info(1, obj);
logger.warn(1, 2, obj);
logger.error(1, 2, 3, obj);

// setting label for trace
logger.setLabel("define-label");
logger.log(obj);
logger.info(1, obj);
logger.warn(1, 2, obj);
logger.error(1, 2, 3, obj);

// setting level for filter
logger.setLabel("level-test");
logger.setLevel(LogLevel.error);
logger.log(obj);
logger.info(1, obj);
logger.warn(1, 2, obj);
logger.error("after set-lelve, you can only see error log");

// use a Interceptor
const logger1 = new Logger({
  label: "interceptor-log",
});
const logger2 = new Logger({
  label: "some-module",
});
Logger.useInterceptor((config, ...args) => {
  const { instance, level } = config;
  if (instance.label === "some-module" && level === LogLevel.error) {
    logger1.warn("Interceptor get [some-module] error event. do something. args:", args);
  }
});
logger2.error("some error event;");

/**
 * Supposed not to see any log except
 * label_filter=labeltest
 */
labelLogger.log("Supposed not to see any log except label_filter=test");
