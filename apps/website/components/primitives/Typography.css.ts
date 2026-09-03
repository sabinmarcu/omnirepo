import { theme } from '@sabinmarcu/theme';
import { styleVariants } from '@vanilla-extract/css';
import { typographyUnstyledDataAttribute } from './Typography.constants';

const headingBase = {
  marginBlockStart: theme.grid.xxl,
  marginBlockEnd: theme.grid.s,
  lineHeight: 1,
} as const;

const dividerHeading = {
  borderBlockStart: `1px solid ${theme.colors.primary.muted}`,
  paddingBlockStart: theme.grid.m,
} as const;

const whenStyled = <Style extends object>(style: Style) => ({
  selectors: {
    [`&:not([${typographyUnstyledDataAttribute}] *)`]: style,
  },
});

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
});
