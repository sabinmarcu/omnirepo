import {
  css,
  defineTheme,
  numberCodec,
  source,
  staticGenerator,
  stringCodec,
  variableGenerator,
} from './index.js';
import { extendTheme } from './extension.js';
import type {
  ThemeInputs,
  ThemePatches,
} from './types.js';

const base = defineTheme({
  colors: {
    primary: variableGenerator({
      scope: 'shared',
      sources: { value: source(stringCodec) },
      build: ({ value }) => ({ tokens: { base: css`${value}` } }),
    }),
  },
  queries: staticGenerator({ compact: '(width < 40rem)' }),
} as const, { prefix: 'extension-types' });

const extended = extendTheme(base, {
  colors: {
    secondary: variableGenerator({
      scope: 'contextual',
      sources: { gap: source(numberCodec, 8) },
      build: ({ gap }) => ({ tokens: { spacing: css`${gap}px` } }),
    }),
  },
  motion: staticGenerator('150ms'),
} as const);

type Inputs = ThemeInputs<typeof extended>;
type Patches = ThemePatches<typeof extended>;

const input: Inputs = { colors: { primary: { value: 'rebeccapurple' } } };
const patch: Patches = { colors: { secondary: { gap: 12 } } };
const exactBase: 'var(--extension-types-colors-primary-base)' = extended.contract.colors.primary.base;
const exactAddition: 'var(--extension-types-colors-secondary-spacing)' = extended.variables.colors.secondary.spacing;
const staticOutput: '150ms' = extended.contract.motion;

const overlap = variableGenerator({
  scope: 'shared',
  sources: {},
  build: () => ({ tokens: { base: css`none` } }),
});
// @ts-expect-error Existing descriptor paths cannot be replaced by an extension.
const rejectedOverlap = extendTheme(base, { colors: { primary: overlap } } as const);
// @ts-expect-error Extension paths use the same valid schema key rules.
const rejectedInvalidPath = extendTheme(base, { invalid_path: overlap } as const);
// @ts-expect-error Flattened allocations cannot collide across the base and extension graphs.
const rejectedFlattenedCollision = extendTheme(base, { 'colors-primary': overlap } as const);
// @ts-expect-error Extensions retain the base prefix and do not accept binding options.
const rejectedPrefix = extendTheme(base, { extra: overlap } as const, { prefix: 'different' });
// @ts-expect-error Static descriptors remain absent from variable-only projections.
const staticAsVariable = extended.variables.motion;

export const extensionTypeAssertions = {
  input,
  patch,
  exactBase,
  exactAddition,
  staticOutput,
  rejectedOverlap,
  rejectedInvalidPath,
  rejectedFlattenedCollision,
  rejectedPrefix,
  staticAsVariable,
};
