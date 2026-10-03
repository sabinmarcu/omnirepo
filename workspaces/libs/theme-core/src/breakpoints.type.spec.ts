import { breakpointGenerator } from './breakpoints.js';
import type { StaticDescriptor } from './types.js';

type Equal<Actual, Expected> = (<Value>() => Value extends Actual ? 1 : 2) extends
(<Value>() => Value extends Expected ? 1 : 2) ? true : false;
type Expect<Value extends true> = Value;

const literalBreakpoints = breakpointGenerator([
  ['phone', 320],
  ['tablet', 768],
  ['desktop', 1280],
] as const);

type LiteralOutput = {
  readonly lt: {
    readonly phone: '(width < 320px)';
    readonly tablet: '(width < 768px)';
    readonly desktop: '(width < 1280px)';
  };
  readonly gt: {
    readonly phone: '(width > 320px)';
    readonly tablet: '(width > 768px)';
    readonly desktop: '(width > 1280px)';
  };
  readonly lte: {
    readonly phone: '(max-width: 320px)';
    readonly tablet: '(max-width: 768px)';
    readonly desktop: '(max-width: 1280px)';
  };
  readonly gte: {
    readonly phone: '(min-width: 320px)';
    readonly tablet: '(min-width: 768px)';
    readonly desktop: '(min-width: 1280px)';
  };
  readonly between: {
    readonly 'phone-tablet': '(320px < width < 768px)';
    readonly 'phone-desktop': '(320px < width < 1280px)';
    readonly 'tablet-desktop': '(768px < width < 1280px)';
  };
};

type LiteralDescriptor = Expect<Equal<typeof literalBreakpoints, StaticDescriptor<LiteralOutput>>>;
type LiteralOutputAssertion = Expect<Equal<typeof literalBreakpoints.output, LiteralOutput>>;

const threshold: number = 640;
const widenedBreakpoints = breakpointGenerator([
  ['compact', threshold],
  ['wide', 1280],
] as const);

type WidenedQueries = Expect<Equal<typeof widenedBreakpoints.output, {
  readonly lt: { readonly compact: `(width < ${number}px)`; readonly wide: '(width < 1280px)' };
  readonly gt: { readonly compact: `(width > ${number}px)`; readonly wide: '(width > 1280px)' };
  readonly lte: { readonly compact: `(max-width: ${number}px)`; readonly wide: '(max-width: 1280px)' };
  readonly gte: { readonly compact: `(min-width: ${number}px)`; readonly wide: '(min-width: 1280px)' };
  readonly between: { readonly 'compact-wide': `(${number}px < width < 1280px)` };
}>>;

// Forward positional pairs only: reverse and self ranges cannot be addressed.
// @ts-expect-error A range only exists when its left breakpoint precedes its right breakpoint.
literalBreakpoints.output.between['tablet-phone'];
// @ts-expect-error A breakpoint cannot form a range with itself.
literalBreakpoints.output.between['phone-phone'];
