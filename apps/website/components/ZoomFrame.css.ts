import { theme } from '@sabinmarcu/theme';
import { style } from '@vanilla-extract/css';
import {
  codeOverlayItemStyle,
  codeOverlayRailStyle,
} from './CodeOverlay.css';

export const zoomFrameStyle = style({
  position: 'relative',
  display: 'block',
  overflow: 'hidden',
  touchAction: 'none',
  cursor: 'grab',
  borderRadius: '2px',
  borderInlineStart: `1px solid color-mix(in hsl, ${theme.colors.primary.muted} 45%, transparent)`,
  borderInlineEnd: `1px solid color-mix(in hsl, ${theme.colors.primary.muted} 45%, transparent)`,
  borderBlockStart: `1px solid color-mix(in hsl, ${theme.colors.primary.muted} 45%, transparent)`,
  borderBlockEnd: `1px solid color-mix(in hsl, ${theme.colors.primary.muted} 45%, transparent)`,
  background: theme.colors.background.surface,
  selectors: { '&:active': { cursor: 'grabbing' } },
});

export const zoomStageStyle = style({
  display: 'block',
  transformOrigin: '0 0',
  willChange: 'transform',
  // Global theme transitions must not interpolate direct-manipulation gestures.
  transition: 'none',
});

export const zoomRailStyle = style([
  codeOverlayRailStyle,
  { '@media': { print: { display: 'none' } } },
]);

export const zoomResetStyle = style([
  codeOverlayItemStyle,
  {
    appearance: 'none',
    background: theme.colors.background.surface,
    color: 'inherit',
    cursor: 'pointer',
    selectors: {
      '&:hover': { background: theme.colors.primary.muted },
      '&:focus-visible': {
        outline: `2px solid ${theme.colors.primary.muted}`,
        outlineOffset: '2px',
      },
      '&:disabled': {
        cursor: 'default',
        opacity: 0.45,
      },
    },
  },
]);

export const zoomResetIconStyle = style({
  fontSize: '1rem',
  lineHeight: 1,
});
