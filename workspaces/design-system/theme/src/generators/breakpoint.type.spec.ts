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
//                  "gt-tablet": "(min-width: 1000px)";
//                  "gt-screen": "(min-width: 1200px)";
//                  "gt-large": "(min-width: 1980px)";
//                  "gt-huge": "(min-width: 3000px)";
//                  "lte-mobile": "(max-width: 700px)";
//                  "lte-tablet": "(max-width: 1000px)";
//                  "lte-screen": "(max-width: 1200px)";
//                  "lte-large": "(max-width: 1980px)";
//                  "lte-huge": "(max-width: 3000px)";
//                  "gte-mobile": "(min-width: 700px)";
//                  "gte-tablet": "(min-width: 1000px)";
//                  ... 22 more ...;
//                  "between-huge-large": "(min-width: 3000px) and (max-width: 1980px)";
//              }

export type BreakpointsOfTestBetweens = Omit<BreakpointsOfTest, `lt-${string}` | `gt-${string}`>;
//           ^? type BreakpointsOfTestBetweens = {
//                  "between-mobile-tablet": "(min-width: 700px) and (max-width: 1000px)";
//                  "between-mobile-screen": "(min-width: 700px) and (max-width: 1200px)";
//                  "between-mobile-large": "(min-width: 700px) and (max-width: 1980px)";
//                  "between-mobile-huge": "(min-width: 700px) and (max-width: 3000px)";
//                  "between-tablet-mobile": "(min-width: 1000px) and (max-width: 700px)";
//                  "between-tablet-screen": "(min-width: 1000px) and (max-width: 1200px)";
//                  "between-tablet-large": "(min-width: 1000px) and (max-width: 1980px)";
//                  "between-tablet-huge": "(min-width: 1000px) and (max-width: 3000px)";
//                  ... 21 more ...;
//                  "gte-huge": "(min-width: 3000px)";
//              }
