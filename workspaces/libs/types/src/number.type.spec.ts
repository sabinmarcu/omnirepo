import type {
  NumberOf,
  NumbersArray,
} from './number.js';

type NumberOfTest1 = NumberOf<'3'>;
//    ^? type NumberOfTest1 = 3

type NumberOfTest2 = NumberOf<'asd'>;
//    ^? type NumberOfTest2 = never

type NumberOfTest3 = NumberOf<'asd3'>;
//    ^? type NumberOfTest3 = never

type NumberOfTest4 = NumberOf<'4asd'>;
//    ^? type NumberOfTest4 = never

type NumberOfTest5 = NumberOf<'3.14'>;
//    ^? type NumberOfTest5 = 3.14

type NumbersArrayTest1 = NumbersArray<3>;
//    ^? type NumbersArrayTest1 = [0, 1, 2]

type NumbersArrayTest2 = NumbersArray<5>;
//    ^? type NumbersArrayTest2 = [0, 1, 2, 3, 4]
