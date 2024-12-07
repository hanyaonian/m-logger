import { Logger, LogLevel, QueryKey } from "../src/index";

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
    logger.error("error");
    expect(consoleMock).toHaveBeenCalledTimes(1);
    expect(consoleMock.mock.calls.at(0)).toContain("error");

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

    // change level
    logger.setLevel(LogLevel.info);
    logger.error("error");
    logger.info("info");
    expect(consoleMock).toHaveBeenCalledTimes(3);
    expect(consoleMock.mock.calls.at(-1)).toContain("info");

    consoleMock.mockClear();
  });
});

describe("Testing log filter with setting by config", () => {});
