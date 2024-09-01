import type {
  Repeats,
  MatchRepeat,
  MatchRepetitionsSplit,
  MatchRepeatInputSplit,
  SameLengthStringUnion,
} from './repeat.js';

type SameLengthStringUnionTest1 = SameLengthStringUnion<'aa'>;
//    ^? type SameLengthStringUnionTest1 = 2

type SameLengthStringUnionTest2 = SameLengthStringUnion<'aaa' | 'aa'>;
//    ^? type SameLengthStringUnionTest2 = never

type TestRepeats1 = Repeats<5>;
//    ^? type TestRepeats1 = [0, 1, 2, 3, 4]

type TestRepetitionsSplit1 = MatchRepetitionsSplit<Repeats<2>>;
//    ^? type TestRepetitionsSplit1 = [1]

type TestRepetitionsSplit2 = MatchRepetitionsSplit<Repeats<1>>;
//    ^? type TestRepetitionsSplit2 = []

type TestRepetitionsSplit3 = MatchRepetitionsSplit<Repeats<0>>;
//    ^? type TestRepetitionsSplit3 = never

type TestInputSplit1 = MatchRepeatInputSplit<'aaa', 'a'>;
//    ^? type TestInputSplit1 = {
//           Match: "a";
//           Rest: "aa";
//       }

type TestInputSplit2 = MatchRepeatInputSplit<'aaa', 'b'>;
//    ^? type TestInputSplit2 = never

type TestInputSplit3 = MatchRepeatInputSplit<'aaa', 'aa'>;
//    ^? type TestInputSplit3 = {
//           Match: "aa";
//           Rest: "a";
//       }

type TestInputSplit4 = MatchRepeatInputSplit<'aaa', 'aa' | 'bb'>;
//    ^? type TestInputSplit4 = {
//           Match: "aa";
//           Rest: "a";
//       }

type TestInputSplit5 = MatchRepeatInputSplit<'aaaaa', 'aaa' | 'bb'>;
//    ^? type TestInputSplit5 = never

type TestInputSplit6 = MatchRepeatInputSplit<'bbbbb', 'aaa' | 'bb'>;
//    ^? type TestInputSplit6 = never

type TestInputSplit7 = MatchRepeatInputSplit<'aabb', 'aa' | 'bb'>;
//    ^? type TestInputSplit7 = {
//           Match: "aa";
//           Rest: "bb";
//       }

type TestInputSplit8 = MatchRepeatInputSplit<'aabbcc', 'aa' | 'bb' | 'cc'>;
//    ^? type TestInputSplit8 = {
//           Match: "aa";
//           Rest: "bbcc";
//       }

type TestMatchRepeat1 = MatchRepeat<'aaaaaa', 'aa', Repeats<3>>;
//     ^? type TestMatchRepeat1 = "aaaaaa"

type TestMatchRepeat2 = MatchRepeat<'aabbcc', 'aa' | 'bb' | 'cc', Repeats<3>>;
//     ^? type TestMatchRepeat2 = "aabbcc"
