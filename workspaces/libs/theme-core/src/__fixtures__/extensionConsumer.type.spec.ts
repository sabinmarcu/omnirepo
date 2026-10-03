import {
  assignVars,
  style,
} from '@vanilla-extract/css';
import {
  css,
  defineTheme,
  source,
  staticGenerator,
  stringCodec,
  variableGenerator,
} from '../index.js';
import { extendTheme } from '../extension.js';

const base = defineTheme({
  colors: {
    base: variableGenerator({
      scope: 'shared',
      sources: { base: source(stringCodec, 'rebeccapurple') },
      build: ({ base: color }) => ({ tokens: { base: css`${color}` } }),
    }),
  },
  queries: staticGenerator({ compact: '(width < 40rem)' }),
} as const, { prefix: 'extension-consumer' });

const extended = extendTheme(base, {
  colors: {
    accent: variableGenerator({
      scope: 'shared',
      sources: { value: source(stringCodec, 'hotpink') },
      build: ({ value }) => ({ tokens: { foreground: css`${value}` } }),
    }),
  },
} as const);

const baseStyle = style({
  vars: assignVars(base.variables.colors.base, { base: 'black' }),
});
const extendedStyle = style({
  vars: assignVars(extended.variables.colors, {
    base: { base: 'black' },
    accent: { foreground: 'white' },
  }),
});

// @ts-expect-error Static contract values are not custom properties for Vanilla Extract assignment.
const rejectedContract = assignVars(extended.contract, {
  colors: {
    base: { base: 'black' },
    accent: { foreground: 'white' },
  },
  queries: { compact: '(width < 40rem)' },
});

export const extensionConsumerAssertions = {
  baseStyle,
  extendedStyle,
  rejectedContract,
};
