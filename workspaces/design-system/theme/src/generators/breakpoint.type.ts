import type {
  Simplify,
  UnionToIntersection,
} from '@sabinmarcu/types';

export type BreakpointsMapping = { [Key: string]: number };
export type BreakpointsOf<
  Breakpoints extends BreakpointsMapping,
> = Simplify<(
  & { [Key in keyof Breakpoints & string as `lt-${Key}`]: `(max-width: ${Breakpoints[Key]}px)` }
  & { [Key in keyof Breakpoints & string as `gt-${Key}`]: `(min-width: ${Breakpoints[Key]}px)` }
  & UnionToIntersection<{
    [First in keyof Breakpoints & string]: {
      [Second in Exclude<keyof Breakpoints, First> & string as `between-${First}-${Second}`]: `(min-width: ${Breakpoints[First]}px) and (max-width: ${Breakpoints[Second]}px)`
    }
  }[keyof Breakpoints & string]>
)>;

