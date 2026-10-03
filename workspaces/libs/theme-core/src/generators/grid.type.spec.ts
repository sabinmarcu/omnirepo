import {
  defineTheme,
} from '../index.js';
import {
  fibonacciGridGenerator,
  gridGenerator,
} from './grid.js';

const zero = defineTheme({ grid: gridGenerator({ pairs: 0 }) });
const four = defineTheme({ grid: gridGenerator({ pairs: 4 }) });
const widenedPairs: number = 2;
const widened = defineTheme({ grid: fibonacciGridGenerator({ pairs: widenedPairs }) });

const zeroMain: 'var(--theme-grid-m)' = zero.contract.grid.m;
const fourSmall: 'var(--theme-grid-xxxs)' = four.contract.grid.xxxs;
const fourLarge: 'var(--theme-grid-xxxl)' = four.contract.grid.xxxl;
const widenedSmall: `var(--theme-grid-${string}s)` = widened.contract.grid.xxxxxs;
const widenedLarge: `var(--theme-grid-${string}l)` = widened.contract.grid.xxxxxl;

// @ts-expect-error A zero-pair scale has no small tokens.
zero.contract.grid.s;
// @ts-expect-error Four pairs end at xxx; the next pair is absent.
four.contract.grid.xxxxs;
// @ts-expect-error Grid units are limited to CSS length units supported by this generator.
gridGenerator({ unit: 'vh' });
// @ts-expect-error Structural pair counts must be numbers.
gridGenerator({ pairs: '3' });

export const spacingAssertions = {
  zeroMain,
  fourSmall,
  fourLarge,
  widenedSmall,
  widenedLarge,
};
