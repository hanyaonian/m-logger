import { LogLevel } from "./types";

export class LogEvent {
  private time = new Date();

  constructor(
    private readonly level: LogLevel,
    private readonly name: string = "",
    readonly data: any[]
  ) {}

  public get logTime() {
    return this.time;
  }

  public get logLevel() {
    return this.level;
  }

  public get logName() {
    return this.name;
  }

  public get logData(): unknown[] {
    return this.data as unknown[];
  }
}
