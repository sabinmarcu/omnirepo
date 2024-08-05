/* eslint-disable no-console */
import debug from 'debug';

const makeLogger = ({
  namespace,
  logFunction = console.log,
  level = '',
}: {
  namespace: string,
  level?: string,
  logFunction?: typeof console.log,
}) => {
  const logger = debug([
    'eslint-config',
    namespace,
    level,
  ].filter(Boolean).join(':'));
  logger.log = logFunction;
  return logger;
};

export const getLogger = (namespace: string) => ({
  log: makeLogger({ namespace }),
  warn: makeLogger({
    namespace,
    logFunction: console.warn,
    level: 'warn ',
  }),
  error: makeLogger({
    namespace,
    logFunction: console.error,
    level: 'error ',
  }),
});
