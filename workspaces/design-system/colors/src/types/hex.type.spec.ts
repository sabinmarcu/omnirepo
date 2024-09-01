import type { Repeats } from '@sabinmarcu/types';
import type {
  HexColorCheck,
  HexColorOf,
  HexColorStringOf,
  HexString,
  HexStringMatch,
  ParseHexColor,
} from './hex.js';

type HexColorValueOfTest1 = HexColorStringOf<'#fff'>;
//    ^? type HexColorValueOfTest1 = "fff"

type HexColorValueOfTest2 = HexColorStringOf<'#ffffff'>;
//    ^? type HexColorValueOfTest2 = "ffffff"

type HexColorValueOfTest3 = HexColorStringOf<'#0cf'>;
//    ^? type HexColorValueOfTest3 = "0cf"

type HexColorValueOfTest4 = HexColorStringOf<'#0cf8'>;
//    ^? type HexColorValueOfTest4 = "0cf8"

type HexColorOfTest1 = HexColorOf<'fff'>;
//    ^? type HexColorOfTest1 = "#fff"

type HexStringMatchTest1 = HexStringMatch<'fff', Repeats<3>>;
//    ^? type HexStringMatchTest1 = "fff"

type HexStringMatchTest2 = HexStringMatch<'ffffff', Repeats<3>>;
//    ^? type HexStringMatchTest2 = "ffffff"

type HexStringMatchTest3 = HexStringMatch<'0cf', Repeats<3>>;
//    ^? type HexStringMatchTest3 = "0cf"

type HexStringTest1 = HexString<'fff'>;
//    ^? type HexStringTest1 = "fff"

type HexStringTest2 = HexString<'ffff'>;
//    ^? type HexStringTest2 = "ffff"

type HexStringTest3 = HexString<'ffffff'>;
//    ^? type HexStringTest3 = "ffffff"

type HexStringTest4 = HexString<'ffffffff'>;
//    ^? type HexStringTest4 = "ffffffff"

type ParseHexColorTest1 = ParseHexColor<'#fff'>;
//    ^? type ParseHexColorTest1 = "#fff"

type ParseHexColorTest2 = ParseHexColor<'#ffff'>;
//    ^? type ParseHexColorTest2 = "#ffff"

type ParseHexColorTest3 = ParseHexColor<'#ffffff'>;
//    ^? type ParseHexColorTest3 = "#ffffff"

type ParseHexColorTest4 = ParseHexColor<'#ffffffff'>;
//    ^? type ParseHexColorTest4 = "#ffffffff"

type ParseHexColorTest5 = ParseHexColor<'#0cfg'>;
//    ^? type ParseHexColorTest5 = never

type HexColorCheckTest1 = HexColorCheck<'#fff'>;
//    ^? type HexColorCheckTest1 = unknown

type HexColorCheckTest2 = HexColorCheck<'#ffff'>;
//    ^? type HexColorCheckTest2 = unknown

type HexColorCheckTest3 = HexColorCheck<'#ffffff'>;
//    ^? type HexColorCheckTest3 = unknown

type HexColorCheckTest4 = HexColorCheck<'#ffffffff'>;
//    ^? type HexColorCheckTest4 = unknown

type HexColorCheckTest5 = HexColorCheck<'#0cfg'>;
//    ^? type HexColorCheckTest5 = never
