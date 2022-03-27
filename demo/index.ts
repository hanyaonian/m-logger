import Logger, { LogLevel } from '../src/index';

const logger = new Logger();

// basic usage
logger.log(1);
logger.info(1, 2);
logger.warn(1, 2, 3);
logger.error(1, 2, 3, 4);

// object log
const obj = { a: 'hello world' };
logger.log(obj);
logger.info(1, obj);
logger.warn(1, 2, obj);
logger.error(1, 2, 3, obj);

// setting label for trace
logger.setLabel('define-label');
logger.log(obj);
logger.info(1, obj);
logger.warn(1, 2, obj);
logger.error(1, 2, 3, obj);

// setting level for filter
logger.setLabel('level-test');
logger.setLevel(LogLevel.error)
logger.log(obj);
logger.info(1, obj);
logger.warn(1, 2, obj);
logger.error('you can only see error log');

// use a Interceptor
const logger1 = new Logger({
  label: 'error-detect',
});
const logger2 = new Logger({
  label: 'some-module'
});
Logger.useInterceptor((config, ...args) => {
  const { instance, level } = config
  if (instance.label === 'some-module' && level === LogLevel.error) {
    logger1.warn('Interceptor get [level-test] error event. do something');
  }
});
logger2.error('some error event;');
