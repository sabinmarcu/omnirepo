import { theme } from '@sabinmarcu/theme';
import { style } from '@vanilla-extract/css';

export const shellPromptLineStyle = style({
  selectors: {
    '&::before': {
      content: '$',
      userSelect: 'none',
      marginInlineEnd: theme.grid.s,
      opacity: 0.5,
    },
  },
});
