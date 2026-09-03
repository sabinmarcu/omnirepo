import { theme } from '@sabinmarcu/theme';
import { style } from '@vanilla-extract/css';

export const codehikeInlineCodeStyle = style({
  display: 'inline-block',
  borderInlineStart: `1px solid ${theme.colors.primary.muted}`,
  borderInlineEnd: `1px solid ${theme.colors.primary.muted}`,
  borderBlockStart: `1px solid ${theme.colors.primary.muted}`,
  borderBlockEnd: `1px solid ${theme.colors.primary.muted}`,
  borderStartStartRadius: '2px',
  borderStartEndRadius: '2px',
  borderEndEndRadius: '2px',
  borderEndStartRadius: '2px',
  background: `color-mix(in oklch, ${theme.colors.background.surface} 70%, transparent)`,
  fontSize: '1em',
  lineHeight: 'inherit',
  paddingInline: theme.grid.xxs,
});
