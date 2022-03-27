import { getQuery } from './utils';

export enum LogLevel {
  slient,
  error,
  warn,
  info,
  all,
}

export const levelColor: Record<LogLevel, string> = {
  0: '',
  1: 'red',
  2: 'orange',
  3: 'skyblue',
  4: 'gray',
};

export const levelDesc: Record<LogLevel, string> = {
  0: '',
  1: '[m-error]',
  2: '[m-warn]',
  3: '[m-info]',
  4: '[m-log]',
};

export const LEVEL = LogLevel[getQuery('log')!];