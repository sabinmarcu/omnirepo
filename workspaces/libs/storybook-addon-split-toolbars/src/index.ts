import type { ToolbarArgType as ToolbarArgumentType } from './types.js';

export type * from './types.js';

export const splitToolbar = <
  Data extends unknown,
  const Input extends ToolbarArgumentType<Data>,
>(
    input: Input,
  ): any => input;
