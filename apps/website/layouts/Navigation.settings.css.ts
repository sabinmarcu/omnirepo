import { theme } from '@sabinmarcu/website-theme';
import type { StyleRule } from '@vanilla-extract/css';
import {
  globalStyle,
  style,
} from '@vanilla-extract/css';
import {
  navigationBorderColor,
  navigationBorderRadius,
  navigationBorderSize,
  navigationSpacing,
} from './Navigation.css';
import { navigationSettingsAnchorName } from './Navigation.settings.constants';

const popoverDuration = '180ms';
const popoverClosed = {
  opacity: 0,
  translate: `0 calc(${navigationSpacing} * -0.5)`,
} as const;

export const navigationSettingsTriggerStyle = style({});

export const navigationSettingsPopoverStyle = style({
  position: 'absolute',
  inset: 'auto',
  insetBlockStart: `calc(anchor(self-end) + ${navigationSpacing})`,
  insetInlineEnd: 'anchor(end)',
  margin: 0,
  padding: navigationSpacing,
  inlineSize: '14rem',
  blockSize: 'auto',
  maxInlineSize: `calc(100vw - ${navigationSpacing} * 2)`,
  boxSizing: 'border-box',

  background: theme.colors.background.surface,
  color: theme.colors.background.text,
  borderInlineStart: `${navigationBorderSize} solid ${navigationBorderColor}`,
  borderInlineEnd: `${navigationBorderSize} solid ${navigationBorderColor}`,
  borderBlockStart: `calc(${navigationBorderSize} * 2) solid ${navigationBorderColor}`,
  borderBlockEnd: `${navigationBorderSize} solid ${navigationBorderColor}`,
  borderRadius: navigationBorderRadius,

  flexFlow: 'column nowrap',
  gap: navigationSpacing,

  ...popoverClosed,
  transition: [
    `translate ${popoverDuration} ease`,
    `opacity ${popoverDuration} ease`,
    `display ${popoverDuration} allow-discrete`,
    `overlay ${popoverDuration} allow-discrete`,
  ].join(', '),

  '@media': {
    '(prefers-reduced-motion)': {
      transition: 'none',
    },
  },

  selectors: {
    '&:popover-open': {
      opacity: 1,
      translate: '0 0',
      '@starting-style': popoverClosed,
    },
  },

  ...({
    positionAnchor: navigationSettingsAnchorName,
    positionTryFallbacks: 'flip-inline, flip-block, flip-inline flip-block',
  } as StyleRule),
});

export const navigationSettingsRowStyle = style({
  display: 'flex',
  alignItems: 'center',
  inlineSize: '100%',
});

globalStyle(`${navigationSettingsRowStyle} > *`, {
  inlineSize: '100%',
});

globalStyle(`${navigationSettingsRowStyle} + ${navigationSettingsRowStyle}`, {
  marginBlockStart: navigationSpacing,
});

export const navigationSettingsCommandStyle = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  inlineSize: '100%',
  blockSize: 'auto',
  minBlockSize: '2.5rem',
  paddingInline: navigationSpacing,
  paddingBlock: navigationSpacing,
  borderInlineStart: `${navigationBorderSize} solid ${navigationBorderColor}`,
  borderInlineEnd: `${navigationBorderSize} solid ${navigationBorderColor}`,
  borderBlockStart: `${navigationBorderSize} solid ${navigationBorderColor}`,
  borderBlockEnd: `${navigationBorderSize} solid ${navigationBorderColor}`,
  borderRadius: navigationBorderRadius,
  background: theme.colors.background.page,
  cursor: 'pointer',
  color: theme.colors.background.text,
  font: 'inherit',

  selectors: {
    '&:hover': {
      background: theme.colors.background.elevated,
    },
  },
});
