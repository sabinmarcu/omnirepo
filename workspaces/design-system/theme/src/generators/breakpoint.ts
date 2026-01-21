import type {
  BreakpointsMapping,
  BreakpointsOf,
} from './breakpoint.type.js';

export const breakpointGenerator = <Breakpoints extends BreakpointsMapping>(
  breakpoints: Breakpoints,
): BreakpointsOf<Breakpoints> => {
  const lowerThans = {} as any;
  const greaterThans = {} as any;

  const keys = Object.keys(breakpoints) as unknown as (keyof Breakpoints & string)[];
  for (const key of keys) {
    lowerThans[`lt-${key}` as unknown as keyof typeof lowerThans] = `(max-width: ${breakpoints[key]}px)`;
    greaterThans[`gt-${key}` as any] = `(min-width: ${breakpoints[key]}px)`;
  }

  const betweens = {} as any;
  for (const first of keys) {
    for (const second of keys) {
      if (first !== second) {
        betweens[`between-${first}-${second}`] = `(min-width: ${breakpoints[first]}px) and (max-width: ${breakpoints[second]}px)`;
      }
    }
  }

  return {
    ...lowerThans,
    ...greaterThans,
    ...betweens,
  };
};

breakpointGenerator.default = '???';
