import {
  assignVars,
  style,
} from '@vanilla-extract/css';
import {
  css,
  defineTheme,
  source,
  stringCodec,
  staticGenerator,
  variableGenerator,
} from '@sabinmarcu/theme-core';
import { createThemeFamily } from '../index.js';

const theme = defineTheme({
  scene: variableGenerator({
    scope: 'contextual',
    sources: { tint: source(stringCodec, 'rebeccapurple') },
    build: ({ tint }) => ({ tokens: { surface: css`${tint}` } }),
  }),
  query: staticGenerator('(width < 40rem)'),
} as const, { prefix: 'family-ve' });

const family = createThemeFamily(theme, {
  id: 'consumer',
  families: ['night'] as const,
});

const publicStyle = style({
  vars: assignVars(theme.variables.scene, { surface: 'black' }),
});
const familyViewStyle = style({
  vars: assignVars(family.themes.night.scene, { surface: 'midnightblue' }),
});
const publicVariables = assignVars(theme.variables.scene, { surface: 'white' });
const familyVariables = assignVars(family.themes.base.scene, { surface: 'linen' });

// @ts-expect-error Static query values prevent whole-contract variable assignment.
const rejectedContract = assignVars(family.contract, {
  scene: { surface: 'black' },
  query: '(width < 40rem)',
});

export const familyConsumerAssertions = {
  publicStyle,
  familyViewStyle,
  publicVariables,
  familyVariables,
  rejectedContract,
};
