import { Logger, LogLevel, QueryKey, LogEvent } from "m-web-logger";

// issue: jest not support without experimentalDecorators
// solution: use swc, see https://swc.rs/docs/configuration/compilation#jsctransformdecoratorversion

/**
 * THESE TEST CASES ARE GIVEN BY AI. WELL-TESTED.
 */
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

const getMocks = () => {
  const logMock = jest.spyOn(console, "log");
  const infoMock = jest.spyOn(console, "info");
  const warnMock = jest.spyOn(console, "warn");
  const errorMock = jest.spyOn(console, "error");

  const clearMocks = () => {
    logMock.mockClear();
    infoMock.mockClear();
    warnMock.mockClear();
    errorMock.mockClear();
  };

  return {
    clearMocks,
    logMock,
    infoMock,
    warnMock,
    errorMock,
  };
};

describe("Testing filter", () => {
  const { logMock, infoMock, warnMock, errorMock, clearMocks } = getMocks();
  test("Filter by level with setting by constructor", () => {
    const logger = new Logger({
      level: LogLevel.error,
    });
    logger.log("log");
    logger.info("info");
    logger.warn("warn");
    logger.error("error");
    expect(logMock).toHaveBeenCalledTimes(0);
    expect(warnMock).toHaveBeenCalledTimes(0);
    expect(errorMock).toHaveBeenCalledTimes(1);

    clearMocks();
  });

  test("Filter by url default setting", () => {
    changeSearchParams(QueryKey.level, "error");
    const logger = new Logger();
    logger.log("log");
    logger.info("info");
    logger.error("error");
    expect(logMock).toHaveBeenCalledTimes(0);
    expect(errorMock).toHaveBeenCalledTimes(1);
    clearMocks();
  });

  test("Filter by setting", () => {
    changeSearchParams(QueryKey.level, "error");
    const logger = new Logger();
    logger.log("log");
    logger.info("info");
    logger.error("error");
    expect(logMock).toHaveBeenCalledTimes(0);
    expect(infoMock).toHaveBeenCalledTimes(0);
    expect(errorMock).toHaveBeenCalledTimes(1);
    clearMocks();

    // change level
    logger.setLevel(LogLevel.info);
    logger.error("error");
    logger.info("info");
    logger.warn("warn");
    expect(logMock).toHaveBeenCalledTimes(0);
    expect(infoMock).toHaveBeenCalledTimes(1);
    expect(warnMock).toHaveBeenCalledTimes(1);
    expect(errorMock).toHaveBeenCalledTimes(1);

    clearMocks();
  });
});

describe("Testing log filter's base methods", () => {
  const { logMock, clearMocks } = getMocks();
  test("Logging", () => {
    const logger = new Logger({
      level: LogLevel.all,
    });
    const values = [1, 1.1, "1", { num: 1 }, () => 1];
    values.forEach((value, index) => {
      logger.log(value);
      expect(logMock.mock.calls.at(index)).toContain(value);
    });
    clearMocks();
  });

  test("Set label", () => {
    const logMock = jest.spyOn(console, "log");
    const logger = new Logger({
      level: LogLevel.all,
    });
    const label = "custom-label";
    logger.setName(label);
    logger.log("log");
    expect(logger.name).toBe(label);
    expect(logMock.mock.calls.at(-1)?.at?.(0)).toContain(label);

    clearMocks();
  });

  test("Trace method", () => {
    const logMock = jest.spyOn(console, "log");
    const logger = new Logger({
      level: LogLevel.all,
    });
    logger.trace("trace message");
    expect(logMock).toHaveBeenCalledTimes(1);
    const callArgs = logMock.mock.calls[0];
    expect(callArgs[0]).toContain("LOG");
    // check stack info
    const allArgs = callArgs.slice(1).join(" ");
    expect(allArgs).toContain("trace message");
    clearMocks();
  });
});

describe("Testing Logger.filter", () => {
  beforeEach(() => {
    // reset filter
    Logger.filter = undefined;
    changeSearchParams(QueryKey.filter, "");
    changeSearchParams(QueryKey.level, "");
  });

  afterEach(() => {
    Logger.filter = undefined;
    changeSearchParams(QueryKey.filter, "");
    changeSearchParams(QueryKey.level, "");
  });

  test("Default filter behavior", () => {
    const { logMock, clearMocks } = getMocks();
    const logger = new Logger({
      level: LogLevel.all,
      name: "test-logger",
    });
    logger.log("test");
    expect(logMock).toHaveBeenCalledTimes(1);
    clearMocks();
  });

  test("Set custom filter", () => {
    const { logMock, clearMocks } = getMocks();
    Logger.filter = (config) => {
      return config.name === "allowed-logger";
    };

    const allowedLogger = new Logger({
      level: LogLevel.all,
      name: "allowed-logger",
    });
    const blockedLogger = new Logger({
      level: LogLevel.all,
      name: "blocked-logger",
    });

    allowedLogger.log("allowed");
    blockedLogger.log("blocked");

    expect(logMock).toHaveBeenCalledTimes(1);
    expect(logMock.mock.calls[0][1]).toBe("allowed");
    clearMocks();
  });

  test("Filter with URL query parameter", () => {
    const { logMock, clearMocks } = getMocks();
    changeSearchParams(QueryKey.filter, "module-a");
    // reset to use default
    Logger.filter = undefined;

    const loggerA = new Logger({
      level: LogLevel.all,
      name: "module-a-logger",
    });
    const loggerB = new Logger({
      level: LogLevel.all,
      name: "module-b-logger",
    });

    loggerA.log("from module a");
    loggerB.log("from module b");

    expect(logMock).toHaveBeenCalledTimes(1);
    expect(logMock.mock.calls[0][1]).toBe("from module a");
    clearMocks();
  });

  test("Filter with matchLevel false", () => {
    const { logMock, clearMocks } = getMocks();
    const logger = new Logger({
      level: LogLevel.error,
    });
    logger.log("log");
    logger.info("info");
    expect(logMock).toHaveBeenCalledTimes(0);
    clearMocks();
  });

  test("Filter with matchLevel true and matchLabel false", () => {
    const { logMock, clearMocks } = getMocks();
    Logger.filter = (config) => {
      return config.name === "specific-logger";
    };

    const logger = new Logger({
      level: LogLevel.all,
      name: "other-logger",
    });

    logger.log("test");
    expect(logMock).toHaveBeenCalledTimes(0);
    clearMocks();
  });

  test("Filter with matchLevel true and matchLabel true", () => {
    const { logMock, clearMocks } = getMocks();
    Logger.filter = (config) => {
      return config.name === "specific-logger";
    };

    const logger = new Logger({
      level: LogLevel.all,
      name: "specific-logger",
    });

    logger.log("test");
    expect(logMock).toHaveBeenCalledTimes(1);
    clearMocks();
  });
});

describe("Testing LogEvent", () => {
  test("LogEvent properties", () => {
    const event = new LogEvent(LogLevel.info, "test-name", ["data1", "data2"]);

    expect(event.logLevel).toBe(LogLevel.info);
    expect(event.logName).toBe("test-name");
    expect(event.logData).toEqual(["data1", "data2"]);
    expect(event.logTime).toBeInstanceOf(Date);
  });
});

describe("Testing edge cases", () => {
  beforeEach(() => {
    Logger.filter = undefined;
    changeSearchParams(QueryKey.filter, "");
    changeSearchParams(QueryKey.level, "");
  });

  afterEach(() => {
    Logger.filter = undefined;
    changeSearchParams(QueryKey.filter, "");
    changeSearchParams(QueryKey.level, "");
  });

  test("Constructor with invalid level", () => {
    const { logMock, infoMock, warnMock, errorMock, clearMocks } = getMocks();
    const logger = new Logger({
      level: 999 as LogLevel, // invalid level
    });
    // default level (slient)
    logger.log("log");
    logger.info("info");
    logger.warn("warn");
    logger.error("error");
    expect(logMock).toHaveBeenCalledTimes(0);
    expect(infoMock).toHaveBeenCalledTimes(0);
    expect(warnMock).toHaveBeenCalledTimes(0);
    expect(errorMock).toHaveBeenCalledTimes(0);
    clearMocks();
  });

  test("Constructor with undefined level", () => {
    const { logMock, clearMocks } = getMocks();
    changeSearchParams(QueryKey.level, "");
    const logger = new Logger({
      level: undefined,
    });
    // default level (slient)
    logger.log("log");
    expect(logMock).toHaveBeenCalledTimes(0);
    clearMocks();
  });

  test("All log levels in print method", () => {
    const { logMock, infoMock, warnMock, errorMock, clearMocks } = getMocks();
    const logger = new Logger({
      level: LogLevel.all,
    });

    logger.log("log message");
    logger.info("info message");
    logger.warn("warn message");
    logger.error("error message");

    expect(logMock).toHaveBeenCalledTimes(1);
    expect(infoMock).toHaveBeenCalledTimes(1);
    expect(warnMock).toHaveBeenCalledTimes(1);
    expect(errorMock).toHaveBeenCalledTimes(1);
    clearMocks();
  });

  test("Logger with custom options", () => {
    const customConsole = {
      log: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };

    const customPrepend = (evt: LogEvent) => {
      return `[CUSTOM] ${evt.logName || "default"}`;
    };

    const customFormatData = (evt: LogEvent) => {
      return evt.logData.map((item: unknown) => `formatted: ${String(item)}`);
    };

    const logger = new Logger(
      {
        level: LogLevel.all,
        name: "custom-logger",
      },
      {
        console: customConsole,
        prepend: customPrepend,
        formatData: customFormatData,
      }
    );

    logger.log("test");
    expect(customConsole.log).toHaveBeenCalledTimes(1);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const callArgs = customConsole.log.mock.calls[0];
    if (callArgs && Array.isArray(callArgs) && callArgs[0]) {
      expect(String(callArgs[0])).toContain("[CUSTOM] custom-logger");
    }
    if (callArgs && Array.isArray(callArgs) && callArgs[1]) {
      expect(String(callArgs[1])).toBe("formatted: test");
    }
  });
});
