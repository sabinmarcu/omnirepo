import type { IsNever } from '@sabinmarcu/types';
import type {
  HSLPatternA,
  HSLPatternH,
  HSLAObject,
  HSLColor,
  HSLString,
  HSLPatternSL,
  // HSLAFromObject,
  // HSLFromPatternH,
  // HSLFromPatternA,
  // HSLFromString,
} from './hsl.js';
import type { ColorFunctions } from './functions.js';

type HPatternTest1 = HSLPatternH<'0'>;
//    ^? type HPatternTest1 = {
//           value: "0";
//           unit: "deg";
//       }

type HPatternTest2 = HSLPatternH<'0deg'>;
//    ^? type HPatternTest2 = {
//           value: "0";
//           unit: "deg";
//       }

type HPatternTest3 = HSLPatternH<'0rad'>;
//    ^? type HPatternTest3 = {
//           value: "0";
//           unit: "rad";
//       }

type HPatternTest4 = HSLPatternH<'none'>;
//    ^? type HPatternTest4 = {
//           value: "0";
//           unit: "deg";
//       }
type HPatternTest5 = HSLPatternH<'asin(120deg)'>;
//    ^? type HPatternTest5 = {
//           value: "asin(120deg)";
//           unit: "";
//       }

type SPatternTest1 = HSLPatternSL<'0%'>;
//    ^? type SPatternTest1 = "0"

type SPatternTest2 = HSLPatternSL<'50%'>;
//    ^? type SPatternTest2 = "50"

type SPatternTest3 = HSLPatternSL<'100%'>;
//    ^? type SPatternTest3 = "100"

type SPatternTest4 = HSLPatternSL<'110%'>;
//    ^? type SPatternTest4 = never

type APatternTest1 = HSLPatternA<'0'>;
//    ^? type APatternTest1 = "0"

type APatternTest2 = HSLPatternA<'0.5'>;
//    ^? type APatternTest2 = "0.5"

type APatternTest3 = HSLPatternA<'50%'>;
//    ^? type APatternTest3 = "0.5"

type APatternTest4 = HSLPatternA<'110%'>;
//    ^? type APatternTest4 = never

type HSLObjectTest1 = HSLAObject<'0', '0%', '100%'>;
//    ^? type HSLObjectTest1 = {
//           h: HType<"0", "deg">;
//           s: "0";
//           l: "100";
//           a: "1";
//       }

type HSLObjectTest2 = HSLAObject<'3rad', '0%', '100%'>;
//    ^? type HSLObjectTest2 = {
//           h: HType<"3", "rad">;
//           s: "0";
//           l: "100";
//           a: "1";
//       }

type HSLObjectTest3 = HSLAObject<'3rad', '0', '100%'>;
//    ^? type HSLObjectTest3 = never

type HSLObjectTest4 = HSLAObject<'3rad', '0%', '100%', '0.5'>;
//    ^? type HSLObjectTest4 = {
//           h: HType<"3", "rad">;
//           s: "0";
//           l: "100";
//           a: "0.5";
//       }

type HSLObjectTest5 = HSLAObject<'3rad', '0%', '100%', '50%'>;
//    ^? type HSLObjectTest5 = {
//           h: HType<"3", "rad">;
//           s: "0";
//           l: "100";
//           a: "0.5";
//       }

type HSLStringTest1 = HSLString<'hsl(0, 0%, 100%)'>;
//    ^? type HSLStringTest1 = {
//           h: HType<"0", "deg">;
//           s: "0";
//           l: "100";
//           a: "1";
//       }

type HSLStringTest2 = HSLString<'hsl(0 0% 100%)'>;
//    ^? type HSLStringTest2 = never

type HSLStringTest3 = HSLString<'hsl(0 0%, 100%)'>;
//    ^? type HSLStringTest3 = never

type HSLStringTest4 = HSLString<'hsl(none 0% 100%)'>;
//    ^? type HSLStringTest4 = never

type HSLStringTest5 = HSLString<'hsl(none 0%, 100%, 0.5)'>;
//    ^? type HSLStringTest5 = {
//           h: HType<"0", "deg">;
//           s: "0";
//           l: "100";
//           a: "0.5";
//       }

type HSLStringTest6 = HSLString<'hsl(none, 0%, 100%, 70%)'>;
//    ^? type HSLStringTest6 = {
//           h: HType<"0", "deg">;
//           s: "0";
//           l: "100";
//           a: "0.7";
//       }

type HSLStringTest7 = HSLString<'hsl(none, 0%, calc(thing / 2), 70%)'>;
//    ^? type HSLStringTest7 = {
//           h: HType<"0", "deg">;
//           s: "0";
//           l: "calc(thing / 2)";
//           a: "0.7";
//       }

type HSLStringTest8 = HSLString<'hsl(none 0%, calc(thing / 2), 70%)'>;
//    ^? type HSLStringTest8 = {
//           h: HType<"0", "deg">;
//           s: "0";
//           l: "calc(thing / 2)";
//           a: "0.7";
//       }

type HSLStringTest9 = HSLString<'hsl(none calc(thing * 2), calc(thing / 2), 70%)'>;
//    ^? type HSLStringTest9 = {
//           h: HType<"0", "deg">;
//           s: "calc(thing * 2)";
//           l: "calc(thing / 2)";
//           a: "0.7";
//       }

type HSLColorTest1 = HSLColor<'hsl(0, 0%, 100%)'>;
//    ^? type HSLColorTest1 = "hsla(0deg, 0%, 100%, 1)"

type HSLColorTest2 = HSLColor<'hsl(0 0% 100%)'>;
//    ^? type HSLColorTest2 = never

type HSLColorTest3 = HSLColor<'hsl(120deg 0% 100%)'>;
//    ^? type HSLColorTest3 = never

type HSLColorTest4 = HSLColor<'hsl(6rad 0% 100%)'>;
//    ^? type HSLColorTest4 = never

type HSLColorTest5 = HSLColor<'hsl(none 0% 100%)'>;
//    ^? type HSLColorTest5 = never

type HSLColorTest6 = HSLColor<'hsl(none, 0% 100%)'>;
//    ^? type HSLColorTest6 = never

type HSLColorTest7 = HSLColor<'hsl(none, 0% 110%)'>;
//    ^? type HSLColorTest7 = never

type HSLColorTest8 = HSLColor<'hsl(none 0%, 100%, 0.5)'>;
//    ^? type HSLColorTest8 = "hsla(0deg, 0%, 100%, 0.5)"

type HSLColorTest9 = HSLColor<'hsl(none, 0%, 100%, 0.5)'>;
//    ^? type HSLColorTest9 = "hsla(0deg, 0%, 100%, 0.5)"

type HSLColorTest10 = HSLColor<'hsl(none 0%, 100%, 70%)'>;
//    ^? type HSLColorTest10 = "hsla(0deg, 0%, 100%, 0.7)"

type HSLColorTest11 = HSLColor<'hsl(none, 0%, 100%, 1.5)'>;
//    ^? type HSLColorTest11 = never

type HSLColorTest12 = HSLColor<'hsl(asin(120deg) 0% 100%)'>;
//    ^? type HSLColorTest12 = never

type HSLColorTest13 = HSLColor<'hsl(atan(120deg), 0%, 100%)'>;
//    ^? type HSLColorTest13 = "hsla(atan(120deg), 0%, 100%, 1)"

type HSLColorTest14 = HSLColor<'hsl(sin(120deg), 0%, 100%, 0.5)'>;
//    ^? type HSLColorTest14 = "hsla(sin(120deg), 0%, 100%, 0.5)"

type HSLColorTest15 = HSLColor<'hsl(var(--thing), 0%, 100%, 0.5)'>;
//    ^? type HSLColorTest15 = "hsla(var(--thing), 0%, 100%, 0.5)"

type HSLColorTest16 = HSLColor<'hsl(var(--h), var(--s), var(--l), var(--a))'>;
//    ^? type HSLColorTest16 = "hsla(var(--h), var(--s), var(--l), var(--a))"

// TODO: Figure out how to properly infer from syntax

// type HSLFromPatternHTest1 = HSLFromPatternH<'h'>;
// //    ^? type HSLFromPatternHTest1 = {
// //           value: "h";
// //           unit: "";
// //       }

// type HSLFromPatternHTest2 = HSLFromPatternH<'120deg'>;
// //    ^? type HSLFromPatternHTest2 = {
// //           value: "120";
// //           unit: "deg";
// //       }

// type HSLFromPatternHTest3 = HSLFromPatternH<'calc(thing)'>;
// //    ^? type HSLFromPatternHTest3 = {
// //           value: "calc(thing)";
// //           unit: "";
// //       }

// type HSLFromPatternATest1 = HSLFromPatternA<'a'>;
// //    ^? type HSLFromPatternATest1 = "a"

// type HSLFromPatternATest2 = HSLFromPatternA<'0.5'>;
// //    ^? type HSLFromPatternATest2 = "0.5"

// type HSLFromPatternATest3 = HSLFromPatternA<'75%'>;
// //    ^? type HSLFromPatternATest3 = "0.75"

// type HSLFromPatternATest4 = HSLFromPatternA<'1'>;
// //    ^? type HSLFromPatternATest4 = "1"

// type HSLFromObjectTest1 = HSLAFromObject<'from', 'h', 's', 'l'>;
// //    ^? type HSLFromObjectTest1 = {
// //           From: "from";
// //           h: HType<"h", "">;
// //           s: "s";
// //           l: "l";
// //           a: "1";
// //       }
// type HSLFromObjectTest2 = HSLAFromObject<'from', 'h', 's', 'l', 'a'>;
// //    ^? type HSLFromObjectTest2 = {
// //           From: "from";
// //           h: HType<"h", "">;
// //           s: "s";
// //           l: "l";
// //           a: "a";
// //       }

// type HSLFromObjectTest3 = HSLAFromObject<'from', '120deg', 's', 'l', '0.5'>;
// //    ^? type HSLFromObjectTest3 = {
// //           From: "from";
// //           h: HType<"120", "deg">;
// //           s: "s";
// //           l: "l";
// //           a: "0.5";
// //       }

// type HSLFromObjectTest4 = HSLAFromObject<'from', '120deg', 'calc(s / 2)', 'l', '0.5'>;
// //    ^? type HSLFromObjectTest4 = {
// //           From: "from";
// //           h: HType<"120", "deg">;
// //           s: "calc(s / 2)";
// //           l: "l";
// //           a: "0.5";
// //       }

// type HSLFromObjectTest5 = HSLAFromObject<'from', 'var(--red)', 'calc(s / 2)', 'l', '0.5'>;
// //    ^? type HSLFromObjectTest5 = {
// //           From: "from";
// //           h: HType<"var(--red)", "">;
// //           s: "calc(s / 2)";
// //           l: "l";
// //           a: "0.5";
// //       }

// type HSLFromStringTest1 = HSLFromString<'hsl(from whatever h s l)'>;
// //    ^? type HSLFromStringTest1 = {
// //           From: "whatever";
// //           h: HType<"h", "">;
// //           s: "s";
// //           l: "l";
// //           a: "1";
// //       }

// type HSLFromStringTest2 = HSLFromString<'hsl(from whatever h s l / a)'>;
// //    ^? type HSLFromStringTest2 = {
// //           From: "whatever";
// //           h: HType<"h", "">;
// //           s: "s";
// //           l: "l";
// //           a: "a";
// //       }

// type HSLFromStringTest3 = HSLFromString<'hsl(from whatever 120deg s l / a)'>;
// //    ^? type HSLFromStringTest3 = {
// //           From: "whatever";
// //           h: HType<"120", "deg">;
// //           s: "s";
// //           l: "l";
// //           a: "a";
// //       }

// type HSLFromStringTest4 = HSLFromString<'hsl(from whatever 120deg calc(whatever) l / 0.5)'>;
// //    ^? type HSLFromStringTest4 = {
// //           From: "whatever";
// //           h: HType<"120", "deg">;
// //           s: "calc(whatever)";
// //           l: "l";
// //           a: "0.5";
// //       }

// type HSLFromStringTest5 = HSLFromString<'hsl(from var(--red) 120deg calc(s * 2) 50%)'>;
// //    ^? type HSLFromStringTest5 = never

// type HSLColorTest17 = HSLColor<'hsl(from whatever h s l)'>;
// //    ^? type HSLColorTest17 = "hsla(from whatever h s l 1)"

// type HSLColorTest18 = HSLColor<'hsl(from var(--red) 120deg calc(s * 2) 50%)'>;
// //    ^? type HSLColorTest18 = never

// type HSLColorTest19 = HSLColor<'hsl(from whatever h s l / a)'>;
// //    ^? type HSLColorTest19 = "hsla(from whatever h s l a)"

// type HSLColorTest20 = HSLColor<'hsl(from whatever 120deg calc(s * 2) l / a)'>;
// //    ^? type HSLColorTest20 = never

