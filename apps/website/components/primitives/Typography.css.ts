import { theme } from '@sabinmarcu/theme';
import {
  createVar,
  globalStyle,
  styleVariants,
} from '@vanilla-extract/css';
import { typographyUnstyledDataAttribute } from './Typography.constants';

const variables = {
  divider: {
    size: createVar('typography-divider-size'),
    color: createVar('typography-divider-color'),
    spacing: createVar('typography-divider-spacing'),
  },
  spacing: {
    start: createVar('typography-spacing-start'),
    end: createVar('typography-spacing-end'),
  },
} as const;

globalStyle('body > main', {
  vars: {
    [variables.divider.size]: '1px',
    [variables.divider.color]: theme.colors.primary.muted,
    [variables.divider.spacing]: theme.grid.m,
    [variables.spacing.start]: theme.grid.xxl,
    [variables.spacing.end]: theme.grid.s,
  },
});

const headingBase = {
  marginBlockStart: variables.spacing.start,
  marginBlockEnd: variables.spacing.end,
  lineHeight: 1,
} as const;

const dividerHeading = {
  borderBlockStart: `${variables.divider.size} solid ${variables.divider.color}`,
  paddingBlockStart: variables.divider.spacing,
} as const;

const whenStyled = <Style extends object>(style: Style) => ({
  selectors: {
    [`&:not([${typographyUnstyledDataAttribute}] *)`]: style,
  },
} as Style);

export const typographyStyles = styleVariants({
  h1: whenStyled({
    ...headingBase,
    fontSize: '3.5rem',
  }),
  h2: whenStyled({
    ...headingBase,
    ...dividerHeading,
    fontSize: theme.grid.xxl,
  }),
  h3: whenStyled({
    ...headingBase,
    fontSize: theme.grid.xl,
  }),
  h4: whenStyled({
    ...headingBase,
    ...dividerHeading,
    borderBlockStartColor: `oklch(from ${variables.divider.color} l c h / 0.2)`,
    fontSize: theme.grid.l,
  }),
  h5: whenStyled({
    ...headingBase,
    fontSize: `calc(${theme.grid.m} * 1.25)`,
  }),
  h6: whenStyled({
    ...headingBase,
    fontSize: theme.grid.m,
  }),
  p: whenStyled({
    paddingBlock: theme.grid.s,
  }),
});
