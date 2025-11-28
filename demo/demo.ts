import { Logger, LogLevel } from "m-web-logger";

const select = document.getElementById("select") as HTMLSelectElement;
select.value = new URLSearchParams(location.search).get("log_level") ?? "";

select.addEventListener("change", () => {
  const { value } = select;
  const url = new URL(location.href);
  const urlSearch = url.searchParams;

  urlSearch.set("log_level", value);
  location.href = url.toString();
});

const logger = new Logger();
const nameLogger = new Logger({ name: "test" });

// basic usage
logger.info(() => {});
logger.trace(1);
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
logger.info(1.1, obj);
logger.warn(1.2, 2, obj);
logger.error(1.3, 2, 3, obj);

// setting label for trace
logger.setName("define-name");
logger.log(obj);
logger.info(1, obj);
logger.warn(1, 2, obj);
logger.error(1, 2, 3, obj);

// setting level for filter
logger.setName("level-test");
logger.setLevel(LogLevel.error);
logger.log(obj);
logger.info(1, obj);
logger.warn(1, 2, obj);
logger.error("after set-level, you can only see error log");

/**
 * Supposed not to see any log except
 * url query: log_name=labeltest
 */
nameLogger.log("Supposed not to see any log except url query has log_name=test");

/**
 * global filter.
 */
const filteredLogger = new Logger({
  name: "global-filter-log",
});

Logger.filter = (config) => {
  if (config.name === "global-filter-log") {
    return true;
  }
  return false;
};

logger.log("I can not log");
filteredLogger.log("I can log");
