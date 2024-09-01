import type {
  AlphaPattern,
  RGBAObject,
  RGBAString,
  RGBColorCheck,
  RGBPattern,
} from './rgb.js';

type RGBPatternTest1 = RGBPattern<'0'>;
//    ^? type RGBPatternTest1 = "0"

type RGBPatternTest2 = RGBPattern<'5'>;
//    ^? type RGBPatternTest2 = "5"

type RGBPatternTest3 = RGBPattern<'255'>;
//    ^? type RGBPatternTest3 = "255"

type RGBPatternTest4 = RGBPattern<'256'>;
//    ^? type RGBPatternTest4 = never

type RGBPatternTest5 = RGBPattern<'300'>;
//    ^? type RGBPatternTest5 = never

type AlphaPatternTest1 = AlphaPattern<'0'>;
//    ^? type AlphaPatternTest1 = "0"

type AlphaPatternTest2 = AlphaPattern<'0.7'>;
//    ^? type AlphaPatternTest2 = "0.7"

type AlphaPatternTest3 = AlphaPattern<'50%'>;
//    ^? type AlphaPatternTest3 = "0.5"

type RGBAObjectTest1 = RGBAObject<'10', '50', '100'>;
//    ^? type RGBAObjectTest1 = {
//           r: "10";
//           g: "50";
//           b: "100";
//           a: "1";
//       }

type RGBAObjectTest2 = RGBAObject<'10', 'calc(100 / 20)', '100', '0.5'>;
//    ^? type RGBAObjectTest2 = {
//           r: "10";
//           g: "calc(100 / 20)";
//           b: "100";
//           a: "0.5";
//       }

type RGBAObjectTest3 = RGBAObject<'10', 'calc(100 / 20)', '100', '70%'>;
//    ^? type RGBAObjectTest3 = {
//           r: "10";
//           g: "calc(100 / 20)";
//           b: "100";
//           a: "0.7";
//       }

type RGBAStringTest1 = RGBAString<'rgb(10, 50, 100)'>;
//    ^? type RGBAStringTest1 = {
//           r: "10";
//           g: "50";
//           b: "100";
//           a: "1";
//       }

type RGBAStringTest2 = RGBAString<'rgb(10, calc(100 / 10), 100)'>;
//    ^? type RGBAStringTest2 = {
//           r: "10";
//           g: "calc(100 / 10)";
//           b: "100";
//           a: "1";
//       }

type RGBAStringTest3 = RGBAString<'rgb(10, calc(100 / 10), 100, 50%)'>;
//    ^? type RGBAStringTest3 = {
//           r: "10";
//           g: "calc(100 / 10)";
//           b: "100";
//           a: "0.5";
//       }

type RGBAStringTest4 = RGBAString<'rgb(10, calc(100 / 10), 100, 0.7)'>;
//    ^? type RGBAStringTest4 = {
//           r: "10";
//           g: "calc(100 / 10)";
//           b: "100";
//           a: "0.7";
//       }

type RGBAStringTest5 = RGBAString<'rgb(256, calc(100 / 10), 100, 0.7)'>;
//    ^? type RGBAStringTest5 = never

type RGBColorCheckTest1 = RGBColorCheck<'rgb(10, 50, 100)'>;
//    ^? type RGBColorCheckTest1 = "rgb(10, 50, 100)"

type RGBColorCheckTest2 = RGBColorCheck<'rgb(10, calc(100 / 10), 100, 0.7)'>;
//    ^? type RGBColorCheckTest2 = "rgb(10, calc(100 / 10), 100, 0.7)"

type RGBColorCheckTest3 = RGBColorCheck<'rgb(256, calc(100 / 10), 100, 0.7)'>;
//    ^? type RGBColorCheckTest3 = never
