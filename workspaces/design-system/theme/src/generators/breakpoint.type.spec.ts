import type { BreakpointsOf } from './breakpoint.type.js';

export type Test = {
  mobile: 700,
  tablet: 1000,
  screen: 1200,
  large: 1980,
  huge: 3000
};

export type BreakpointsOfTest = BreakpointsOf<Test>;
//           ^? type BreakpointsOfTest = {
//                  "lt-mobile": "(max-width: 700px)";
//                  "lt-tablet": "(max-width: 1000px)";
//                  "lt-screen": "(max-width: 1200px)";
//                  "lt-large": "(max-width: 1980px)";
//                  "lt-huge": "(max-width: 3000px)";
//                  "gt-mobile": "(min-width: 700px)";
//                  ... 23 more ...;
//                  "between-huge-large": "(min-width: 3000px) and (max-width: 1980px)";
//              }

export type BreakpointsOfTestBetweens = Omit<BreakpointsOfTest, `lt-${string}` | `gt-${string}`>;
//           ^? type BreakpointsOfTestBetweens = {
//                  "between-mobile-tablet": "(min-width: 700px) and (max-width: 1000px)";
//                  "between-mobile-screen": "(min-width: 700px) and (max-width: 1200px)";
//                  "between-mobile-large": "(min-width: 700px) and (max-width: 1980px)";
//                  ... 16 more ...;
//                  "between-huge-large": "(min-width: 3000px) and (max-width: 1980px)";
//              }
