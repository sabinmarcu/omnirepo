import { theme } from '@sabinmarcu/theme';
import {
  createVar,
  style,
} from '@vanilla-extract/css';

const skillPillBorderColor = createVar();
export const skillPillStyle = style({
  display: 'inline-grid',
  placeItems: 'center',
  paddingInline: theme.grid.s,

  borderInlineStart: `solid 1px ${skillPillBorderColor}`,
  borderInlineEnd: `solid 1px ${skillPillBorderColor}`,
  borderBlockStart: `solid 1px ${skillPillBorderColor}`,
  borderBlockEnd: `solid 1px ${skillPillBorderColor}`,

  borderStartStartRadius: '2px',
  borderStartEndRadius: '2px',
  borderEndEndRadius: '2px',
  borderEndStartRadius: '2px',

  background: `color-mix(in hsl, ${theme.colors.primary.muted} 20%, transparent)`,

  vars: {
    [skillPillBorderColor]: `color-mix(in hsl, ${theme.colors.primary.muted} 40%, transparent)`,
  },
});
