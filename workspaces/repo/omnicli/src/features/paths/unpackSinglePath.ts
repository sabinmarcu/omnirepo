import type { Split } from 'type-fest';
import { singlePathSeparator } from './constants';
import type { SinglePathSeparator } from './types';

export const unpackSinglePath = <
  Input extends string,
>(
  input: Input,
): Split<Input, SinglePathSeparator> => (
  input.split(singlePathSeparator) as any
);
