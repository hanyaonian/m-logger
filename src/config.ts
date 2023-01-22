import { getQuery } from './utils';

export enum LogLevel {
  slient,
  error,
  warn,
  info,
  all,
}

export const levelColor: Record<LogLevel, string> = {
  [LogLevel.slient]: '',
  [LogLevel.error]: 'red',
  [LogLevel.warn]: 'orange',
  [LogLevel.info]: 'skyblue',
  [LogLevel.all]: 'gray',
};

export const levelDesc: Record<LogLevel, string> = {
  [LogLevel.slient]: '',
  [LogLevel.error]: '[m-error]',
  [LogLevel.warn]: '[m-warn]',
  [LogLevel.info]: '[m-info]',
  [LogLevel.all]: '[m-log]',
};

export const LEVEL = LogLevel[getQuery('log')!];