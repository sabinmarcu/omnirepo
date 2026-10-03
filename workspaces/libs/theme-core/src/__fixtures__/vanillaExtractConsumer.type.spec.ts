import {
  assignVars,
  fallbackVar,
  style,
} from '@vanilla-extract/css';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import {
  css,
  defineTheme,
  source,
  staticGenerator,
  stringCodec,
  variableGenerator,
} from '../index.js';

const theme = defineTheme({
  colors: variableGenerator({
    scope: 'shared',
    sources: { base: source(stringCodec, 'rebeccapurple') },
    build: ({ base }) => ({ tokens: { background: css`${base}` } }),
  }),
  breakpoints: staticGenerator({ compact: '(width < 40rem)' }),
} as const, { prefix: 've-consumer' });

const className = style({
  color: fallbackVar(theme.variables.colors.background, 'black'),
  vars: assignVars(theme.variables.colors, { background: 'rebeccapurple' }),
});

const assignedVariables = assignVars(theme.variables.colors, {
  background: 'rebeccapurple',
});

const inlineVariables = assignInlineVars(theme.variables.colors, {
  background: 'rebeccapurple',
});

// @ts-expect-error Whole contracts include static values and cannot be passed to variable assignment helpers.
const staticContractAssignment = assignVars(theme.contract, {
  colors: { background: 'rebeccapurple' },
  breakpoints: { compact: '(width < 40rem)' },
});

export const consumerAssertions = {
  className,
  assignedVariables,
  inlineVariables,
  staticContractAssignment,
};
