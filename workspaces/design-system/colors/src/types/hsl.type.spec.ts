import type { IsNever } from '@sabinmarcu/types';
import type {
  HSLPatternA,
  HSLPatternH,
  HSLAObject,
  HSLColorCheck,
  HSLString,
  HSLPatternSL,
  ParseHSLColor,
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

type ParseHSLColorTest1 = ParseHSLColor<'hsl(0, 0%, 100%)'>;
//    ^? type ParseHSLColorTest1 = "hsla(0deg, 0%, 100%, 1)"

type ParseHSLColorTest2 = ParseHSLColor<'hsl(0 0% 100%)'>;
//    ^? type ParseHSLColorTest2 = never

type ParseHSLColorTest3 = ParseHSLColor<'hsl(120deg 0% 100%)'>;
//    ^? type ParseHSLColorTest3 = never

type ParseHSLColorTest4 = ParseHSLColor<'hsl(6rad 0% 100%)'>;
//    ^? type ParseHSLColorTest4 = never

type ParseHSLColorTest5 = ParseHSLColor<'hsl(none 0% 100%)'>;
//    ^? type ParseHSLColorTest5 = never

type ParseHSLColorTest6 = ParseHSLColor<'hsl(none, 0% 100%)'>;
//    ^? type ParseHSLColorTest6 = never

type ParseHSLColorTest7 = ParseHSLColor<'hsl(none, 0% 110%)'>;
//    ^? type ParseHSLColorTest7 = never

type ParseHSLColorTest8 = ParseHSLColor<'hsl(none 0%, 100%, 0.5)'>;
//    ^? type ParseHSLColorTest8 = "hsla(0deg, 0%, 100%, 0.5)"

type ParseHSLColorTest9 = ParseHSLColor<'hsl(none, 0%, 100%, 0.5)'>;
//    ^? type ParseHSLColorTest9 = "hsla(0deg, 0%, 100%, 0.5)"

type ParseHSLColorTest10 = ParseHSLColor<'hsl(none 0%, 100%, 70%)'>;
//    ^? type ParseHSLColorTest10 = "hsla(0deg, 0%, 100%, 0.7)"

type ParseHSLColorTest11 = ParseHSLColor<'hsl(none, 0%, 100%, 1.5)'>;
//    ^? type ParseHSLColorTest11 = never

type ParseHSLColorTest12 = ParseHSLColor<'hsl(asin(120deg) 0% 100%)'>;
//    ^? type ParseHSLColorTest12 = never

type ParseHSLColorTest13 = ParseHSLColor<'hsl(atan(120deg), 0%, 100%)'>;
//    ^? type ParseHSLColorTest13 = "hsla(atan(120deg), 0%, 100%, 1)"

type ParseHSLColorTest14 = ParseHSLColor<'hsl(sin(120deg), 0%, 100%, 0.5)'>;
//    ^? type ParseHSLColorTest14 = "hsla(sin(120deg), 0%, 100%, 0.5)"

type ParseHSLColorTest15 = ParseHSLColor<'hsl(var(--thing), 0%, 100%, 0.5)'>;
//    ^? type ParseHSLColorTest15 = "hsla(var(--thing), 0%, 100%, 0.5)"

type ParseHSLColorTest16 = ParseHSLColor<'hsl(var(--h), var(--s), var(--l), var(--a))'>;
//    ^? type ParseHSLColorTest16 = "hsla(var(--h), var(--s), var(--l), var(--a))"

type HSLColorCheckTest1 = HSLColorCheck<'hsl(0, 0%, 100%)'>;
//    ^? type HSLColorCheckTest1 = unknown

type HSLColorCheckTest2 = HSLColorCheck<'hsl(0 0% 100%)'>;
//    ^? type HSLColorCheckTest2 = never

type HSLColorCheckTest3 = HSLColorCheck<'hsl(120deg 0% 100%)'>;
//    ^? type HSLColorCheckTest3 = never

type HSLColorCheckTest4 = HSLColorCheck<'hsl(6rad 0% 100%)'>;
//    ^? type HSLColorCheckTest4 = never

type HSLColorCheckTest5 = HSLColorCheck<'hsl(none 0% 100%)'>;
//    ^? type HSLColorCheckTest5 = never

type HSLColorCheckTest6 = HSLColorCheck<'hsl(none, 0% 100%)'>;
//    ^? type HSLColorCheckTest6 = never

type HSLColorCheckTest7 = HSLColorCheck<'hsl(none, 0% 110%)'>;
//    ^? type HSLColorCheckTest7 = never

type HSLColorCheckTest8 = HSLColorCheck<'hsl(none 0%, 100%, 0.5)'>;
//    ^? type HSLColorCheckTest8 = unknown

type HSLColorCheckTest9 = HSLColorCheck<'hsl(none, 0%, 100%, 0.5)'>;
//    ^? type HSLColorCheckTest9 = unknown

type HSLColorCheckTest10 = HSLColorCheck<'hsl(none 0%, 100%, 70%)'>;
//    ^? type HSLColorCheckTest10 = unknown

type HSLColorCheckTest11 = HSLColorCheck<'hsl(none, 0%, 100%, 1.5)'>;
//    ^? type HSLColorCheckTest11 = never

type HSLColorCheckTest12 = HSLColorCheck<'hsl(asin(120deg) 0% 100%)'>;
//    ^? type HSLColorCheckTest12 = never

type HSLColorCheckTest13 = HSLColorCheck<'hsl(atan(120deg), 0%, 100%)'>;
//    ^? type HSLColorCheckTest13 = unknown

type HSLColorCheckTest14 = HSLColorCheck<'hsl(sin(120deg), 0%, 100%, 0.5)'>;
//    ^? type HSLColorCheckTest14 = unknown

type HSLColorCheckTest15 = HSLColorCheck<'hsl(var(--thing), 0%, 100%, 0.5)'>;
//    ^? type HSLColorCheckTest15 = unknown

type HSLColorCheckTest16 = HSLColorCheck<'hsl(var(--h), var(--s), var(--l), var(--a))'>;
//    ^? type HSLColorCheckTest16 = unknown

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

