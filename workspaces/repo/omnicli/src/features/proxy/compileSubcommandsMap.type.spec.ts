import type {
  MapOfSubcommandsList,
} from './types.js';
import { compileSubcommandsMap } from './compileSubcommandsMap.js';
import { testSubcommands } from '../__mocks__/list.js';

type MapOfSubcommandsListTest = MapOfSubcommandsList<typeof testSubcommands>;
//    ^? type MapOfSubcommandsListTest = {
//           test1: typeof Test1;
//           test2: typeof Test2;
//           test3: typeof Test2;
//           test4: typeof Test3;
//           "test5:test6": typeof Test3;
//       }

const compileSubcommandsMapTest = compileSubcommandsMap(testSubcommands);
//    ^? const compileSubcommandsMapTest: MapOfSubcommandsList<readonly [typeof Test1, typeof Test2, typeof Test3]>

type keysOfCompileSubcommandsMapTest = keyof typeof compileSubcommandsMapTest;
//    ^? type keysOfCompileSubcommandsMapTest = "test1" | "test2" | "test3" | "test4" | "test5:test6"
