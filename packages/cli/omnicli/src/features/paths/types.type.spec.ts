import type {
  PrimaryPathsOfCommand,
  SinglePathOf,
  SinglePathsOf,
} from './types';

import type { Test1 } from '../__mocks__/test1';

type SinglePathOfTest1 = SinglePathOf<['a']>;
//    ^? type SinglePathOfTest1 = "a"

type SinglePathOfTest2 = SinglePathOf<['a', 'b']>;
//    ^? type SinglePathOfTest2 = never

type SinglePathsOfTest1 = SinglePathsOf<[['a']]>;
//    ^? type SinglePathsOfTest1 = "a"

type SinglePathsOfTest2 = SinglePathsOf<[['a'], ['b']]>;
//    ^? type SinglePathsOfTest2 = "a" | "b"

type SinglePathsOfTest3 = SinglePathsOf<[['a'], ['a', 'b']]>;
//    ^? type SinglePathsOfTest3 = "a"

type SinglePathsOfTest4 = SinglePathsOf<[['a', 'b'], ['a']]>;
//    ^? type SinglePathsOfTest4 = "a"

type SinglePathsOfTest5 = SinglePathsOf<[['a', 'b']]>;
//   ^? type SinglePathsOfTest5 = never

type PrimaryPathOfCommandTest1 = PrimaryPathsOfCommand<typeof Test1>;
//    ^? type PrimaryPathOfCommandTest1 = "test1"
