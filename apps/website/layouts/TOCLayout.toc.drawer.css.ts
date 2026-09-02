import { theme } from '@sabinmarcu/theme';
import {
  globalStyle,
  style,
} from '@vanilla-extract/css';
import { iconSize } from '@/components/Icon.css';
import { mobileMedia } from '@/utils/responsive';
import { navigationSpacing } from './Navigation.css';
import { tocLayoutTOCStyles } from './TOCLayout.toc.css';
import {
  tocTriggerBlock,
  tocTriggerBorderSize,
  tocTriggerInline,
  tocTriggerMargin,
} from './TOCLayout.css';
import {
  tocMinInlineSize,
  whenTier,
} from './TOCLayout.tiers';
import { gridLines } from './grid.lines';

const drawerDuration = '220ms';
const drawerClosed = {
  translate: '-100% 0',
  opacity: 0,
} as const;

/**
 * Floats in the content's logical-start gutter, inset by the same margins the rail uses.
 * Rides the middle of the viewport, except on mobile where it lines up with the navbar.
 */
export const tocDrawerTriggerStyles = style({
  display: 'none',
  gridColumn: `${gridLines.fullStart} / ${gridLines.contentStart}`,
  gridRow: 1,

  alignItems: 'center',
  justifyContent: 'center',

  position: 'sticky',
  insetBlockStart: `calc(50dvb - ${tocTriggerBlock} / 2)`,
  // Mobile floats the navbar's settings button at this same inset, so the two line up.
  ...mobileMedia({
    insetBlockStart: navigationSpacing,
  }),

  // Content-box, so the border lands outside the sized box exactly as the navbar's does.
  boxSizing: 'content-box',
  marginInlineStart: tocTriggerMargin,
  inlineSize: tocTriggerInline,
  blockSize: tocTriggerBlock,

  cursor: 'pointer',
  color: theme.colors.background.text,
  background: `color-mix(in hsl, ${theme.colors.primary.base} 50%, ${theme.colors.background.page})`,

  borderStartStartRadius: '3px',
  borderStartEndRadius: '3px',
  borderEndEndRadius: '3px',
  borderEndStartRadius: '3px',

  borderInlineStart: `solid ${tocTriggerBorderSize} ${theme.colors.background.elevated}`,
  borderInlineEnd: `solid ${tocTriggerBorderSize} ${theme.colors.background.elevated}`,
  borderBlockStart: `solid ${tocTriggerBorderSize} ${theme.colors.background.elevated}`,
  borderBlockEnd: `solid ${tocTriggerBorderSize} ${theme.colors.background.elevated}`,

  vars: {
    [iconSize]: '1.1em',
  },
});

whenTier('drawer', tocDrawerTriggerStyles, {
  display: 'inline-flex',
});

// Top layer means the drawer needs no z-index of its own.
// `allow-discrete` on display/overlay keeps the panel rendered while it slides back out.
whenTier('drawer', tocLayoutTOCStyles, {
  position: 'fixed',
  insetBlockStart: 0,
  insetBlockEnd: 0,
  insetInlineStart: 0,
  insetInlineEnd: 'auto',

  inlineSize: `min(${tocMinInlineSize}px, 85vw)`,
  blockSize: '100dvb',

  paddingInlineStart: 0,
  paddingInlineEnd: 0,

  ...drawerClosed,
  transition: [
    `translate ${drawerDuration} ease`,
    `opacity ${drawerDuration} ease`,
    `display ${drawerDuration} allow-discrete`,
    `overlay ${drawerDuration} allow-discrete`,
  ].join(', '),

  '@media': {
    '(prefers-reduced-motion)': {
      transition: 'none',
    },
  },
});

whenTier('drawer', `${tocLayoutTOCStyles}:popover-open`, {
  translate: '0 0',
  opacity: 1,
  '@starting-style': drawerClosed,
});

globalStyle(`${tocLayoutTOCStyles}::backdrop`, {
  background: 'rgb(0 0 0 / 0.5)',
  opacity: 0,
  transition: [
    `opacity ${drawerDuration} ease`,
    `display ${drawerDuration} allow-discrete`,
    `overlay ${drawerDuration} allow-discrete`,
  ].join(', '),
});

globalStyle(`${tocLayoutTOCStyles}:popover-open::backdrop`, {
  opacity: 1,
  '@starting-style': {
    opacity: 0,
  },
});

// The rail tiers keep the heading flush with the panel; only the drawer needs a close affordance.
export const tocDrawerCloseStyles = style({
  display: 'inline-grid',
  placeItems: 'center',

  cursor: 'pointer',
  color: 'inherit',
  background: 'transparent',

  paddingBlock: 0,
  paddingInline: 0,
  marginBlock: 0,
  marginInline: 0,

  borderInlineStart: 'none',
  borderInlineEnd: 'none',
  borderBlockStart: 'none',
  borderBlockEnd: 'none',

  vars: {
    [iconSize]: '0.85em',
  },
});

whenTier(['centered', 'folded'], tocDrawerCloseStyles, {
  display: 'none',
});
