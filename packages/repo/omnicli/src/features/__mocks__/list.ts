import type { SubcommandsList } from '../proxy/types';
import { Test1 } from './test1';
import { Test2 } from './test2';
import { Test3 } from './test3';

export const testSubcommands = [
  Test1,
  Test2,
  Test3,
] as const satisfies SubcommandsList;
