import type {
  ColorCheck,
  ParseColor,
} from './index.js';

type ColorCheckTest1 = ColorCheck<'rgba(10, 20, 30)'>;
//    ^? type ColorCheckTest1 = "rgba(10, 20, 30)"

type ColorCheckTest2 = ColorCheck<'#fff'>;
//    ^? type ColorCheckTest2 = "#fff"

type ColorCheckTest3 = ColorCheck<'hsl(10, 20%, 30%)'>;
//    ^? type ColorCheckTest3 = "hsl(10, 20%, 30%)"

type ColorCheckTest4 = ColorCheck<'hsla(10, 20%, 30%, 0.5)'>;
//    ^? type ColorCheckTest4 = "hsla(10, 20%, 30%, 0.5)"

type ColorCheckTest5 = ColorCheck<'#ff'>;
//    ^? type ColorCheckTest5 = never

type ColorCheckTest6 = ColorCheck<'hsl(10, 20%, 30)'>;
//    ^? type ColorCheckTest6 = never

type ColorCheckTest7 = ColorCheck<'hsl(10, calc(100 / 200), 30%, 100%)'>;
//    ^? type ColorCheckTest7 = "hsl(10, calc(100 / 200), 30%, 100%)"

type ParseColorTest1 = ParseColor<'rgba(10, 20, 30)'>;
//    ^? type ParseColorTest1 = "rgba(10, 20, 30)"

type ParseColorTest2 = ParseColor<'#fff'>;
//    ^? type ParseColorTest2 = "#fff"

type ParseColorTest3 = ParseColor<'hsl(10, 20%, 30%)'>;
//    ^? type ParseColorTest3 = "hsla(10deg, 20%, 30%, 1)"

type ParseColorTest4 = ParseColor<'hsla(10, 20%, 30%, 0.5)'>;
//    ^? type ParseColorTest4 = "hsla(10deg, 20%, 30%, 0.5)"

type ParseColorTest5 = ParseColor<'#ff'>;
//    ^? type ParseColorTest5 = never

type ParseColorTest6 = ParseColor<'hsl(10, 20%, 30)'>;
//    ^? type ParseColorTest6 = never

type ParseColorTest7 = ParseColor<'hsl(10, calc(100 / 200), 30%, 100%)'>;
//    ^? type ParseColorTest7 = "hsla(10deg, calc(100 / 200), 30%, 0.1)"
