import type {
  MapOfSubcommandsList,
} from './types';
import { compileSubcommandsMap } from './compileSubcommandsMap';
import { testSubcommands } from '../__mocks__/list';

type MapOfSubcommandsListTest = MapOfSubcommandsList<typeof testSubcommands>;
//    ^? type MapOfSubcommandsListTest = {
//           [x: string]: any;
//       }

const compileSubcommandsMapTest = compileSubcommandsMap(testSubcommands);
//    ^? const compileSubcommandsMapTest: MapOfSubcommandsList<any, any>

type keysOfCompileSubcommandsMapTest = keyof typeof compileSubcommandsMapTest;
//    ^? type keysOfCompileSubcommandsMapTest = any
