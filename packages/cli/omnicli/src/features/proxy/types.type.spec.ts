import type { PrimaryPathsOfCommand } from '../paths';
import type {
  FindKV,
  KVSubcommandsList,
  MapOfSubcommandsList,
} from './types';
import type { testSubcommands } from '../__mocks__/list';
import type { Test1 } from '../__mocks__/test1';
import type { Test2 } from '../__mocks__/test2';

type PrimaryPathOfCommandTest1 = PrimaryPathsOfCommand<typeof Test1>;
//    ^? type PrimaryPathOfCommandTest1 = "test1"

type PrimaryPathOfCommandTest2 = PrimaryPathsOfCommand<typeof Test2>;
//    ^? type PrimaryPathOfCommandTest2 = "test2" | "test3"

type KVSubcommandsListTest = KVSubcommandsList<typeof testSubcommands>;
//    ^? type KVSubcommandsListTest = {
//           item: typeof Test1;
//           paths: "test1";
//       } | {
//           item: typeof Test2;
//           paths: "test2" | "test3";
//       } | {
//           item: typeof Test3;
//           paths: "test4" | "test5:test6";
//       }

type FindKVTest1 = FindKV<typeof testSubcommands, 'test1'>;
//    ^? type FindKVTest1 = "test1"

type FindKVTest2 = FindKV<typeof testSubcommands, 'test2'>;
//    ^? type FindKVTest2 = "test2" | "test3"

type MapOfSubcommandsListTest = MapOfSubcommandsList<typeof testSubcommands>;
//    ^? type MapOfSubcommandsListTest = {
//           test1: typeof Test1;
//           test2: typeof Test2;
//           test3: typeof Test2;
//           test4: typeof Test3;
//           "test5:test6": typeof Test3;
//       }
