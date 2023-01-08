import type {
  MapOfSubcommandsList,
} from './types';
import { compileSubcommandsMap } from './compileSubcommandsMap';
import { testSubcommands } from '../__mocks__/list';

type MapOfSubcommandsListTest = MapOfSubcommandsList<typeof testSubcommands>;
//    ^? type MapOfSubcommandsListTest = {
//           test1: typeof Test1;
//           test2: typeof Test2;
//           test3: typeof Test2;
//       }

const compileSubcommandsMapTest = compileSubcommandsMap(testSubcommands);
//    ^? const compileSubcommandsMapTest: MapOfSubcommandsList<readonly [typeof Test1, typeof Test2], {
//           item: typeof Test1;
//           paths: "test1";
//       } | {
//           item: typeof Test2;
//           paths: "test2" | "test3";
//       }>

type keysOfCompileSubcommandsMapTest = keyof typeof compileSubcommandsMapTest;
//    ^? type keysOfCompileSubcommandsMapTest = "test1" | "test2" | "test3"
