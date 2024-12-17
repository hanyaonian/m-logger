import { Logger, LogLevel, QueryKey } from "../src/index";
import type { Interceptor } from "../src/index";

const changeSearchParams = (key: string, val: string) => {
  const [base] = window.location.href.split("?");
  const params = new URLSearchParams(window.location.search);
  params.set(key, val);
  setURL(`${base}?${params.toString()}`);
};

const setURL = (url: string) => {
  const location: any = new URL(url);
  Object.assign(location, {
    assign: jest.fn(),
    reload: jest.fn(),
    replace: jest.fn(),
  });
  // @ts-expect-error see https://github.com/jestjs/jest/issues/890
  delete window.location;
  // eslint-disable-next-line
  window.location = location;
};

describe("Testing filter", () => {
  const consoleMock = jest.spyOn(console, "log");

  test("Filter by level with setting by constructor", () => {
    const logger = new Logger({
      level: LogLevel.error,
    });
    logger.log("log");
    logger.info("info");
    logger.warn("warn");
    logger.error("error");
    expect(consoleMock).toHaveBeenCalledTimes(1);
    expect(consoleMock.mock.calls.at(-1)).toContain("error");

    consoleMock.mockClear();
  });

  test("Filter by url default setting", () => {
    changeSearchParams(QueryKey.level, "error");
    const logger = new Logger();
    logger.log("log");
    logger.info("info");
    logger.error("error");
    expect(consoleMock).toHaveBeenCalledTimes(1);
    expect(consoleMock.mock.calls.at(-1)).toContain("error");
    consoleMock.mockClear();
  });

  test("Filter by setting", () => {
    changeSearchParams(QueryKey.level, "error");
    const logger = new Logger();
    logger.log("log");
    logger.info("info");
    logger.error("error");
    expect(consoleMock).toHaveBeenCalledTimes(1);
    expect(consoleMock.mock.calls.at(-1)).toContain("error");
    consoleMock.mockClear();

    // change level
    logger.setLevel(LogLevel.info);
    logger.error("error");
    logger.info("info");
    logger.warn("warn");
    expect(consoleMock).toHaveBeenCalledTimes(3);
    expect(consoleMock.mock.calls.at(-1)).toContain("warn");

    consoleMock.mockClear();
  });
});

describe("Testing log filter's interceptor", () => {
  const consoleMock = jest.spyOn(console, "log");
  const logger1 = new Logger({
    label: "interceptor-log",
    level: LogLevel.all,
  });
  const logger2 = new Logger({
    label: "some-module",
    level: LogLevel.all,
  });
  let recorder = 0;
  const interceptorFunc: Interceptor = (info) => {
    const { config = {}, callLevel } = info;
    const { label } = config;
    if (label === "some-module" && callLevel === LogLevel.error) {
      recorder += 1;
    }
  };
  const trigger = () => {
    recorder = 0;
    logger1.error("some error here");
    logger1.error("some info here");
    logger2.info("some info there;");
    // this would be captured
    logger2.error("some error there;");
  };

  test("Add Interceptor", () => {
    Logger.useInterceptor(interceptorFunc);
    expect(Logger.interceptors.length).toBe(1);
  });

  test("Use Interceptor", () => {
    trigger();
    expect(recorder).toBe(1);
    expect(consoleMock).toHaveBeenCalledTimes(4);
    consoleMock.mockClear();
  });

  test("Remove Interceptor", () => {
    Logger.removeInterceptor(interceptorFunc);
    trigger();
    expect(recorder).toBe(0);
    expect(consoleMock).toHaveBeenCalledTimes(4);
    expect(Logger.interceptors.length).toBe(0);
    consoleMock.mockClear();
  });
});

describe("Testing log filter's base methods", () => {
  test("Logging", () => {
    const consoleMock = jest.spyOn(console, "log");
    const logger = new Logger({
      level: LogLevel.all,
    });
    const values = [1, 1.1, "1", { num: 1 }, () => 1];
    values.forEach((value, index) => {
      logger.log(value);
      expect(consoleMock.mock.calls.at(index)).toContain(value);
    });
    consoleMock.mockClear();
  });

  test("Set label", () => {
    const consoleMock = jest.spyOn(console, "log");
    const logger = new Logger({
      level: LogLevel.all,
    });
    const label = "custom-label";
    logger.setLabel(label);
    logger.log("log");
    expect(logger.label).toBe(label);
    expect(consoleMock.mock.calls.at(-1)?.at?.(0)).toContain(label);

    consoleMock.mockClear();
  });

  test("Arguments validation", () => {
    const errorMock = jest.spyOn(console, "error");
    const logger = new Logger({ level: LogLevel.all });
    logger.log();
    expect(errorMock).toHaveBeenCalledWith("Missing required argument in log.");
    errorMock.mockClear();
  });
});
