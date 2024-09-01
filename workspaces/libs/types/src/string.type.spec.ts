import type {
  Trim,
  TrimLeft,
  TrimRight,
} from './string.js';

type TrimLeftTest1 = TrimLeft<'  abc  '>;
//     ^? type TrimLeftTest1 = "abc  "

type TrimLeftTest2 = TrimLeft<'abcba', 'a'>;
//     ^? type TrimLeftTest2 = "bcba"

type TrimLeftTest3 = TrimLeft<'aaabcbaaa', 'a'>;
//     ^? type TrimLeftTest3 = "bcbaaa"

type TrimLeftTest4 = TrimLeft<'\tabcba\t'>;
//     ^? type TrimLeftTest4 = "abcba\t"

type TrimRightTest1 = TrimRight<'  abc  '>;
//     ^? type TrimRightTest1 = "  abc"

type TrimRightTest2 = TrimRight<'abcba', 'a'>;
//     ^? type TrimRightTest2 = "abcb"

type TrimRightTest3 = TrimRight<'aaabcbaaa', 'a'>;
//     ^? type TrimRightTest3 = "aaabcb"

type TrimRightTest4 = TrimRight<'\tabcba\t'>;
//     ^? type TrimRightTest4 = "\tabcba"

type TrimTest1 = Trim<'  abc  '>;
//     ^? type TrimTest1 = "abc"

type TrimTest2 = Trim<'abcba', 'a'>;
//     ^? type TrimTest2 = "bcb"

type TrimTest3 = Trim<'aaabcbaaa', 'a'>;
//     ^? type TrimTest3 = "bcb"

type TrimTest4 = Trim<'\tabcba\t'>;
//     ^? type TrimTest4 = "abcba"
