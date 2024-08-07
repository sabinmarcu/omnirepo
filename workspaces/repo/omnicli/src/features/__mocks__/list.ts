import type { SubcommandsList } from '../proxy/types.js';
import { Test1 } from './test1.js';
import { Test2 } from './test2.js';
import { Test3 } from './test3.js';

export const testSubcommands = [
  Test1,
  Test2,
  Test3,
] as const satisfies SubcommandsList;
