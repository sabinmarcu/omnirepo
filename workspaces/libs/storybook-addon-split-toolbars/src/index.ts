import type { ToolbarArgType as ToolbarArgumentType } from './types.js';
import { unpackIdent as unpackIdentifier } from './utils/ident.js';

export type * from './types.js';

export const splitToolbar = <
  Data extends unknown,
  const Input extends ToolbarArgumentType<Data>,
>(
  input: Input,
): any => input;

splitToolbar.unpack = unpackIdentifier;
