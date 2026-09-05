import { theme } from '@sabinmarcu/theme';
import { style } from '@vanilla-extract/css';
import { codeOverlayItemStyle } from './CodeOverlay.css';

export const copyButtonStyle = style([
  codeOverlayItemStyle,
  {
    appearance: 'none',
    background: theme.colors.background.surface,
    color: 'inherit',
    cursor: 'pointer',

    selectors: {
      '&:hover': {
        background: theme.colors.primary.muted,
      },
      '&:focus-visible': {
        outline: `2px solid ${theme.colors.primary.muted}`,
        outlineOffset: '2px',
      },
    },
    },
]);

export const copyIconStyle = style({
  fontSize: '1.25rem',
});
