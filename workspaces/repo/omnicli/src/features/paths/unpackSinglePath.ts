import type { Split } from '@sabinmarcu/types';
import { singlePathSeparator } from './constants.js';
import type { SinglePathSeparator } from './types.js';

export const unpackSinglePath = <
  Input extends string,
>(
  input: Input,
): Split<Input, SinglePathSeparator> => (
  input.split(singlePathSeparator) as any
);
