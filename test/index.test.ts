import { Logger, LogLevel, QueryKey } from "m-web-logger";

// jest not support without experimentalDecorators
// solution: use swc, see https://swc.rs/docs/configuration/compilation#jsctransformdecoratorversion

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
});
