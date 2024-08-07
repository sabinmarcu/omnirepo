import { subject } from '@sabinmarcu/observable';
import type {
  PrintFunction,
  PrintFunctionMap,
} from './types.js';

// eslint-disable-next-line no-console
export const globalPrintFunction = subject<PrintFunction>(console.log);
// eslint-disable-next-line no-console
export const globalErrorFunction = subject<PrintFunction>(console.error);
// eslint-disable-next-line no-console
export const globalInfoFunction = subject<PrintFunction>(console.info);
// eslint-disable-next-line no-console
export const globalWarnFunction = subject<PrintFunction>(console.warn);

export const globalPrintFunctions = {
  error: globalErrorFunction,
  warn: globalWarnFunction,
  info: globalInfoFunction,
  debug: globalPrintFunction,
} as const satisfies PrintFunctionMap;
