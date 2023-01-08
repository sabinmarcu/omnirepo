import type {
  PrimaryPathsOfCommand,
  SinglePathOf,
  SinglePathsOf,
} from './types';

import type { Test1 } from '../__mocks__/test1';

type SinglePathOfTest1 = SinglePathOf<['a']>;
//    ^? type SinglePathOfTest1 = "a"

type SinglePathOfTest2 = SinglePathOf<['a', 'b']>;
//    ^? type SinglePathOfTest2 = "a:b"

type SinglePathOfTest3 = SinglePathOf<['a', 'b', 'c']>;
//    ^? type SinglePathOfTest3 = "a:b:c"

type SinglePathsOfTest1 = SinglePathsOf<[['a']]>;
//    ^? type SinglePathsOfTest1 = "a"

type SinglePathsOfTest2 = SinglePathsOf<[['a'], ['b']]>;
//    ^? type SinglePathsOfTest2 = "a" | "b"

type SinglePathsOfTest3 = SinglePathsOf<[['a'], ['a', 'b']]>;
//    ^? type SinglePathsOfTest3 = "a" | "a:b"

type SinglePathsOfTest4 = SinglePathsOf<[['a', 'b'], ['a']]>;
//    ^? type SinglePathsOfTest4 = "a" | "a:b"

type SinglePathsOfTest5 = SinglePathsOf<[['a', 'b']]>;
//   ^? type SinglePathsOfTest5 = "a:b"

type SinglePathsOfTest6 = SinglePathsOf<[['a', 'b', 'c']]>;
//   ^? type SinglePathsOfTest6 = "a:b:c"

type PrimaryPathOfCommandTest1 = PrimaryPathsOfCommand<typeof Test1>;
//    ^? type PrimaryPathOfCommandTest1 = "test1"
