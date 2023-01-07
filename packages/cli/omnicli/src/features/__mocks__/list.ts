import type { SubcommandsList } from '../proxy/types';
import { Test1 } from './test1';
import { Test2 } from './test2';

export const testSubcommands = [
  Test1,
  Test2,
] as const satisfies SubcommandsList;
