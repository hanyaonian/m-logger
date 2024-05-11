import { BaseLogger, Config } from "../base";

export class Tracker extends BaseLogger {
  constructor(config: Config) {
    super(config);
  }

  public warn(..._args: any[]) {}

  public log(..._args: any[]) {}

  public error(..._args: any[]) {}

  public info(..._args: any[]) {}
}
